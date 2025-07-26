import jwt from 'jsonwebtoken';

const sendToken = (user, statusCode, res) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME,
    });

    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000 //604,800,000 ms is seven days 
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
    };

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
        message: "Welcome back! You’ve successfully signed in.",
        user,
    });
};

export default sendToken;