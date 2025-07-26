import { connectDB } from "../lib/mongodb.js";
import { User } from '../models/user.js'
import bcrypt from "bcryptjs" //argon2(hight secure app like banking), scrypt, bcrypt
import sendToken from '../utils/jwtToken.js'
import getResetPasswordToken from '../utils/getResetPasswordToken.js'
import sendGmail from '../utils/sendGmail.js'
import otpEmail from '../utils/otpEmail.js'
import axios from 'axios';
import jwt from "jsonwebtoken";
import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import unirest from 'unirest'
const otpStore = new Map();
import { OAuth2Client } from 'google-auth-library';

import speakeasy from "speakeasy";
import qrcode from "qrcode";

import qs from 'qs';


export const register = catchAsyncErrors(async (req, res, next) => {
    try {
        const { email, password, mobile } = req.body;
        await connectDB();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.create({ email, password: hashedPassword, mobile });

        sendToken(user, 200, res);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

export const login = catchAsyncErrors(async (req, res, next) => {
    try {
        const { email, password } = req.body;
        await connectDB();

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid password" });

        sendToken(user, 200, res);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
    try {
        await connectDB();

        const users = await User.find();

        return res.status(200).json({ success: true, users })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch users"
        })

    }

})

export const deleteUser = catchAsyncErrors(async (req, res, next) => {
    try {
        const id = req.params.id;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Id is required to delete user",
            });
        }
        await connectDB();
        const result = await User.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found or already deleted",
            });
        }

        return res.status(200).json({
            isDeleted: true,
            message: "User deleted successfully",
            deletedCount: result.deletedCount,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete user",
            error: error.message,
        });
    }
})

export const updateUser = catchAsyncErrors(async (req, res) => {
    try {
        const id = req.params.id;
        const { email } = req.body;

        if (!email || !id) {
            return res.status(400).json({
                success: false,
                message: "Email and valid id are required",
            });
        }

        await connectDB();

        const user = await User.findOneAndUpdate({ _id: id }, { email }, {
            new: true,
            runValidators: true,
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            isUpdated: true,
            message: "User updated successfully",
            user,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update user",
            error: error.message,
        });
    }
});


export const getUserDetails = catchAsyncErrors(async (req, res) => {
    try {

        await connectDB();

        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
});


export const logout = catchAsyncErrors(async (req, res) => {
    try {
        res.cookie('token', null, {
            expires: new Date(Date.now()),
            httpOnly: true
        })

        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Logout failed",
            error: error.message
        });
    }
});

//Google, Facebbok, Git, Twitter Login & Register
export const authRegister = catchAsyncErrors(async (req, res, next) => {
    try {
        const { email, name, provider, photo, mobile, uid } = req.body;

        await connectDB();

        const cleanEmail = email?.trim().toLowerCase();
        let user = null;

        // 1. Check by email
        if (cleanEmail) {
            user = await User.findOne({ email: cleanEmail });
        }

        // 2. Fallback: Check by provider + providerId
        if (!user && provider && uid) {
            user = await User.findOne({ provider, providerId: uid });
        }

        // 3. User already exists
        if (user) {
            sendToken(user, 200, res);
            return res.status(200).json({ message: "User already exists", user });
        }

        // 4. Create new user
        user = await User.create({
            ...(cleanEmail && { email: cleanEmail }),
            name: name || "",
            provider: provider || "local",
            providerId: uid || "",
            imageName: photo || "",
            mobile: mobile || "",
        });

        sendToken(user, 200, res);
        return res.status(201).json({ message: "User registered", user });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});



//Linkdin Login & Register
export const authLinkedInRegister = catchAsyncErrors(async (req, res) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({ error: "Authorization code is required" });
        }

        await connectDB();

        // STEP 1: Exchange code for access_token and id_token
        const tokenRes = await axios.post(
            "https://www.linkedin.com/oauth/v2/accessToken",
            new URLSearchParams({
                grant_type: "authorization_code",
                code,
                redirect_uri: `${process.env.URL}/linkedin`,
                client_id: process.env.LINKEDIN_CLIENT_ID,
                client_secret: process.env.LINKEDIN_CLIENT_SECRET,
            }),
            {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            }
        );

        const { access_token, id_token } = tokenRes.data;

        if (!id_token) {
            return res.status(400).json({ error: "Missing id_token from LinkedIn" });
        }

        // STEP 2: Decode id_token (JWT) to extract user info
        const decoded = jwt.decode(id_token);

        if (!decoded?.email || !decoded?.name) {
            return res.status(400).json({ error: "Incomplete user info from LinkedIn" });
        }

        const email = decoded.email;
        const name = decoded.name;
        const picture = decoded.picture || "";
        const mobile = "";

        // STEP 3: Store or update user
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                email,
                name,
                provider: "linkedin",
                imageName: picture,
                mobile,
            });
        }

        // STEP 4: Respond with token
        return sendToken(user, 200, res);

    } catch (error) {
        console.error("LinkedIn Auth Error:", error?.response?.data || error.message);
        return res.status(500).json({ error: "LinkedIn authentication failed" });
    }
});

//Forget Password 
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    console.log("req.body", req.body);

    const { email } = req.body;

    // Validate email format
    if (!validator.validate(email)) {
        return res.status(400).json({ message: "Invalid email" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ error: true, message: "User not found with the provided email address." });
    }

    // Generate token and expiry
    const { resetPasswordToken, resetPasswordExpire } = getResetPasswordToken.getResetPasswordToken();

    // Update user
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpire = resetPasswordExpire;
    await user.save();

    /** or
     await User.updateOne(
        { email: email },
        {
            $set: {
                resetPasswordToken: resetPasswordToken,
                resetPasswordExpire: resetPasswordExpire
            }
        }
    );
    */

    // Build reset link
    const resetUrl = `${req.protocol}://sgsro.com/reset/${resetPasswordToken}`;
    const message = resetPassword(resetUrl);

    // Send email
    const mailOptions = {
        from: process.env.EMAIL_SERVICE_USER,
        to: user.email,
        subject: "SGSRO Password Recovery",
        html: message
    };

    sendGmail.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.error("Email send error:", err);
            return res.status(500).json({ message: "Failed to send email. Please try again." });
        }

        console.log("Email sent:", info);
        return res.status(200).json({
            success: true,
            message: `Password reset email sent to: ${user.email}`
        });
    });
});


/*** Email Verify */
export const emailVerification = catchAsyncErrors(async (req, res, next) => {
    const email = req.body.email;
    const otp = Math.floor(1000 + Math.random() * 9000);
    const message = otpEmail(otp);

    const expiresAt = Date.now() + 10 * 60 * 1000; // expires in 10 minutes
    otpStore.set(email, { otp: otp, expiresAt });


    try {
        await connectDB();
        let user = await User.findOne({ email: email });

        if (user) {
            return res.status(400).json({ error: "Account already exists." });
        }

        const mailOptions = {
            from: `${process.env.EMAIL_SERVICE_USER}`,
            to: `${email}`,
            subject: 'Verification Code for ABC',
            html: message
        }

        sendGmail.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log(err);
                return res.status(500).send({ message: "Verification email could not be sent" });
            } else {
                res.status(200).json({
                    success: true,
                    message: "OTP sent successfully"
                });
            }
        });


    } catch (error) {
        console.log(error.message);
        return res.status(500).send({ message: "Verification email could not be completed" });
    }
});

export const verifyEmailOtp = catchAsyncErrors(async (req, res, next) => {
    const { email, otp } = req.body;

    const record = otpStore.get(email);


    if (!record) {
        return res.status(400).json({ success: false, message: "No OTP found for this email" });
    }

    const { otp: storedOtp, expiresAt } = record;

    if (Date.now() > expiresAt) {
        otpStore.delete(email); // optional
        return res.status(400).json({ success: false, message: "OTP expired" });
    }

    if (storedOtp != otp) {
        return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // OTP is valid
    otpStore.delete(email); // optional, clean up
    res.status(200).json({ success: true, emailOtp: true, message: "Email verified successfully" });
});


/*** Mobile Verify */
export const mobileVerification = catchAsyncErrors(async (req, res, next) => {
    const mobile = req.body.mobile;
    const otp = Math.floor(1000 + Math.random() * 9000);

    const user = await User.findOne({ mobile: req.body.mobile });
    if (user) {
        return res.status(400).json({ error: "Account already exists." });
    }

    const expiresAt = Date.now() + 5 * 60 * 1000; // expires in 5 minutes
    otpStore.set(mobile, { otp: otp, expiresAt });


    try {

        // request.headers({
        //     "authorization": process.env.SMS_API_KEY
        // });

        // request.form({
        //     "message": `Your verification code is: ${otp}. SMSAPP`,
        //     "language": "english",
        //     "route": "q",
        //     "numbers": `${mobile}`,
        // });

        const apiKey = process.env.SMS_API_KEY;

        const request = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");

        request.headers({
            "authorization": apiKey,
            "Content-Type": "application/x-www-form-urlencoded"
        });

        request.form({
            "route": "otp",
            "variables_values": otp.toString(),
            "numbers": mobile,
            "flash": "0"
        });

        request.end(function (response) {
            if (response.error) {
                winston.error('SMS send error', response.error);

                return res.status(500).json({
                    success: false,
                    message: 'Failed to send SMS',
                    error: 'Failed to send SMS'
                });
            } else {
                return res.status(200).json({
                    success: true,
                    data: otp
                });
            }
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).send({ message: "Verification email could not be completed" });
    }
});

export const verifyMobileOtp = catchAsyncErrors(async (req, res, next) => {
    const { mobile, otp } = req.body;


    const record = otpStore.get(mobile);

    if (!record) {
        return res.status(400).json({ success: false, message: "No OTP found for this mobile" });
    }

    const { otp: storedOtp, expiresAt } = record;

    if (Date.now() > expiresAt) {
        otpStore.delete(mobile); // optional
        return res.status(400).json({ success: false, message: "OTP expired" });
    }

    if (storedOtp != otp) {
        return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // OTP is valid
    otpStore.delete(mobile); // optional, clean up
    res.status(200).json({ success: true, mobileOtp: true, message: "Mobile verified successfully" });
});


const userSecrets = new Map();
// Google 2FA Authentication
// Step 1: Generate secret and send QR code
export const generate2FA = async (req, res) => {
    const secret = speakeasy.generateSecret({ name: "MyAppName" });

    const userId = req.ip; // Or generate a temp UUID if needed
    userSecrets.set(userId, secret.base32); // Store secret in memory temp/db
    // await User.findByIdAndUpdate(userId, { twoFASecret: secret.base32 });

    qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
        if (err) return res.status(500).json({ message: "QR error" });

        res.json({ qrCode: data_url }); // Don't send secret to client
    });
};



// Step 2: Verify OTP
export const verify2FA = async (req, res) => {
    const { token } = req.body;
    const userId = req.ip;

    const secret = userSecrets.get(userId);
    if (!secret) {
        return res.status(400).json({ success: false, message: "Secret not found" });
    }

    //  const user = await User.findById(userId);
    // if (!user || !user.twoFASecret) {
    //     return res.status(400).json({ success: false, message: "2FA not set up" });
    // }

    const isVerified = speakeasy.totp.verify({
        secret,
        encoding: "base32",
        token,
        window: 1,
    });

    if (isVerified) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: "Invalid token" });
    }
};


export const authGoogleRegister = catchAsyncErrors(async (req, res) => {
    const { token } = req.body;

    const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

    try {
        const client = new OAuth2Client(CLIENT_ID);
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });

        const payload = ticket.getPayload();

        const { email, name, picture } = payload;

        await connectDB();

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                email,
                name,
                imageName: picture,
                provider: "google",
            });
        }

        sendToken(user, 200, res);

    } catch (err) {
        console.error('Google Login Error:', err);
        return res.status(401).json({ error: 'Invalid Google token' });
    }
});

export const authGithub = async (req, res) => {
    const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
    const redirect_uri = `${process.env.BACKEND_URL}/api/auth/github/callback`;

    const githubURL = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirect_uri}&scope=user:email`;
    res.redirect(githubURL);
};


export const authGithubRegister = catchAsyncErrors(async (req, res) => {
    const code = req.query.code;

    if (!code) return res.status(400).json({ error: 'No code provided' });

    try {
        // Step 1: Exchange code for access token
        const tokenRes = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            {
                headers: { Accept: 'application/json' },
            }
        );

        const access_token = tokenRes.data.access_token;

        if (!access_token) return res.status(400).json({ error: 'Access token failed' });

        // Step 2: Get GitHub user info
        const userRes = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const emailRes = await axios.get('https://api.github.com/user/emails', {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const primaryEmail = emailRes.data.find((e) => e.primary && e.verified)?.email;

        if (!primaryEmail) return res.status(400).json({ error: 'Email not found' });

        const { name, avatar_url, login } = userRes.data;

        // Step 3: DB connection + User lookup/creation
        await connectDB();

        let user = await User.findOne({ email: primaryEmail });

        if (!user) {
            user = await User.create({
                email: primaryEmail,
                name: name || login,
                imageName: avatar_url,
                provider: 'github',
            });
        }

        // Step 4: Generate token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_TIME,
        });

        // Step 5: Set cookie
        res.cookie('token', token, {
            expires: new Date(
                Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
        });

        // Step 6: Redirect to frontend with token in query (optional redundancy)
        const redirectURL = `${process.env.URL}/success?token=${token}`;
        return res.redirect(redirectURL);
    } catch (err) {
        console.error('GitHub OAuth Error:', err);
        return res.status(500).json({ error: 'GitHub OAuth failed' });
    }
});


export const authFacebookRegister = catchAsyncErrors(async (req, res) => {
    const code = req.query.code;

    if (!code) return res.status(400).json({ error: 'No code provided' });

    try {
        // Step 1: Exchange code for access token
        // In your backend controller:
        const tokenRes = await axios.get(`https://graph.facebook.com/v17.0/oauth/access_token`, {
            params: {
                client_id: process.env.FACEBOOK_CLIENT_ID,
                client_secret: process.env.FACEBOOK_CLIENT_SECRET,
                redirect_uri: `${process.env.BACKEND_URL}/api/auth/facebook/callback`,
                code,
            },
        });


        const access_token = tokenRes.data.access_token;

        // Step 2: Fetch user profile
        const profileRes = await axios.get(
            `https://graph.facebook.com/me`, {
            params: {
                fields: 'id,name,email,picture',
                access_token,
            },
        }
        );
        const { id: facebookId, email, name, picture } = profileRes.data;

        await connectDB();

        let user;

        if (email) {
            user = await User.findOne({ email });
        }

        if (!user) {
            user = await User.findOne({ providerId: facebookId, provider: 'facebook' });
        }

        if (!user) {
            user = await User.create({
                email,
                name,
                imageName: picture?.data?.url || '',
                provider: 'facebook',
                providerId: facebookId,
            });
        }


        // Step 4: Generate token & redirect
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_TIME,
        });

        res.cookie('token', token, {
            expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
        });

        const redirectURL = `${process.env.URL}/success?token=${token}`;
        return res.redirect(redirectURL);
    } catch (err) {
        console.error('Facebook OAuth Error:', err.response?.data || err);
        res.status(500).json({ error: 'Facebook OAuth failed' });
    }
});

export const authTwitterRegister = catchAsyncErrors(async (req, res) => {
    const code = req.query.code;
    const code_verifier = req.cookies.twitter_code_verifier;

    if (!code || !code_verifier) {
        return res.status(400).json({ error: 'Missing code or code_verifier' });
    }

    try {

        const basicAuth = Buffer.from(
            `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`
        ).toString('base64');

        const body = qs.stringify({
            code,
            grant_type: 'authorization_code',
            redirect_uri: `${process.env.BACKEND_URL}/api/auth/twitter/callback`,
            code_verifier,
        });

        const tokenRes = await axios.post('https://api.twitter.com/2/oauth2/token', body, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${basicAuth}`,
            },
        });


        const access_token = tokenRes.data.access_token;

        const profileRes = await axios.get('https://api.twitter.com/2/users/me', {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const { id, name, username } = profileRes.data.data;
        await connectDB();


        let user = await User.findOne({ providerId: id, provider: 'twitter' });

        if (!user) {
            user = await User.create({
                // email: username,
                name,
                provider: 'twitter',
                providerId: id,
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_TIME,
        });

        res.cookie('token', token, {
            expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
        });

        // Clean up the code_verifier cookie
        res.clearCookie('twitter_code_verifier');

        res.redirect(`${process.env.URL}/success?token=${token}`);
    } catch (err) {
        console.error('Twitter OAuth Error:', err.response?.data || err);
        res.status(500).json({ error: 'Twitter OAuth failed' });
    }
});


export const authInstagramRegister = catchAsyncErrors(async (req, res) => {
    console.log("dsd");
    
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ error: "Authorization code is required" });
    }

    try {
        // Step 1: Exchange code for access token
        const tokenRes = await axios({
            method: 'post',
            url: 'https://api.instagram.com/oauth/access_token',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: new URLSearchParams({
                client_id: process.env.INSTAGRAM_CLIENT_ID,
                client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
                grant_type: 'authorization_code',
                redirect_uri: `${process.env.BACKEND_URL}/api/auth/instagram/callback`, // Match redirect URI exactly
                code,
            }),
        });

        const { access_token, user_id } = tokenRes.data;

        // Step 2: Get user profile
        const userRes = await axios.get(`https://graph.instagram.com/${user_id}`, {
            params: {
                fields: 'id,username,account_type',
                access_token,
            },
        });

        const { username } = userRes.data;
        const name = username;
        const email = `${username}@instagram.placeholder`;

        // Step 3: Register or find user
        let user = await User.findOne({ providerId: user_id, provider: 'instagram' });

        if (!user) {
            user = await User.create({
                name,
                email,
                provider: 'instagram',
                providerId: user_id,
            });
        }

        // Step 4: Send token
        sendToken(user, 200, res);
    } catch (err) {
        console.error('Instagram OAuth Error:', err.response?.data || err.message);
        res.status(500).json({ error: 'Instagram OAuth failed' });
    }
});

