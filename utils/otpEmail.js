export default function otpEmail(getEmailCode) {
   return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="x-apple-disable-message-reformatting">
    <title>Verify Your Email</title>
    <link href="https://fonts.googleapis.com/css?family=Lato:300,400,700" rel="stylesheet">
    
    <style type="text/css">
        /* Base styles */
        body, html {
            margin: 0 !important;
            padding: 0 !important;
            height: 100% !important;
            width: 100% !important;
            font-family: 'Lato', sans-serif;
            background: #f5f5f5;
            line-height: 1.6;
            color: #333333;
        }
        
        /* Prevent auto-resizing in email clients */
        * {
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%;
        }
        
        /* Outlook link fix */
        a {
            color: #30e3ca;
            text-decoration: none;
        }
        
        /* Remove spacing in tables */
        table, td {
            mso-table-lspace: 0pt !important;
            mso-table-rspace: 0pt !important;
        }
        
        /* Fix image rendering */
        img {
            -ms-interpolation-mode: bicubic;
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
            display: block;
        }
        
        /* Hide preview text */
        .email-hidden {
            display: none !important;
            visibility: hidden;
            opacity: 0;
            color: transparent;
            height: 0;
            width: 0;
        }
        
        /* Main container */
        .email-container {
            max-width: 600px;
            margin: 0 auto;
        }
        
        /* Header styles */
        .header {
            padding: 30px 30px 20px 30px;
            text-align: center;
            background: #ffffff;
        }
        
        .logo {
            margin-bottom: 15px;
        }
        
        .logo img {
            width: 80px;
            height: auto;
        }
        
        .logo h1 {
            margin: 10px 0 0 0;
            font-size: 24px;
            font-weight: 700;
            color: #30e3ca;
        }
        
        /* Hero section */
        .hero {
            background: #ffffff;
            padding: 20px 0;
            text-align: center;
        }
        
        .hero-image {
            width: 200px;
            height: auto;
            margin: 0 auto;
        }
        
        /* Content section */
        .content {
            background: #ffffff;
            padding: 30px 40px;
            text-align: center;
        }
        
        h1 {
            font-size: 28px;
            font-weight: 400;
            margin: 0 0 15px 0;
            color: #000000;
        }
        
        h2 {
            font-size: 22px;
            font-weight: 400;
            margin: 0 0 15px 0;
            color: #000000;
        }
        
        h3 {
            font-size: 18px;
            font-weight: 300;
            margin: 0 0 15px 0;
            color: #555555;
        }
        
        p {
            margin: 0 0 15px 0;
            font-size: 16px;
            line-height: 1.6;
            color: #555555;
        }
        
        /* OTP code box */
        .otp-code {
            display: inline-block;
            background: #30e3ca;
            color: #ffffff;
            font-size: 24px;
            font-weight: 700;
            padding: 15px 30px;
            margin: 20px 0;
            border-radius: 5px;
            letter-spacing: 2px;
        }
        
        /* Time limit notice */
        .time-limit {
            color: #e74c3c;
            font-weight: 600;
            margin: 15px 0;
        }
        
        /* Footer */
        .footer {
            background: #f9f9f9;
            padding: 20px 30px;
            text-align: center;
            font-size: 12px;
            color: #999999;
            border-top: 1px solid #eeeeee;
        }
        
        /* Responsive styles */
        @media screen and (max-width: 600px) {
            .content {
                padding: 20px !important;
            }
            
            .header, .footer {
                padding: 20px !important;
            }
            
            h1 {
                font-size: 24px !important;
            }
            
            h2 {
                font-size: 20px !important;
            }
            
            .otp-code {
                font-size: 20px !important;
                padding: 12px 25px !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5;">
    <!-- Hidden preview text -->
    <div style="display: none; max-height: 0px; overflow: hidden;">
        Your verification code is ${getEmailCode}. Use this code to verify your email address. This code is valid for 10 minutes only.
    </div>
    
    <!-- Email container -->
    <center style="width: 100%; background-color: #f5f5f5;">
        <div class="email-container" style="max-width: 600px; margin: 0 auto;">
            <!-- Header -->
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="header" style="padding: 30px 30px 20px 30px; text-align: center; background: #ffffff;">
                        <div class="logo">
                            <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" alt="Company Logo" style="width: 80px; height: auto;">
                            <h1 style="margin: 10px 0 0 0; font-size: 24px; font-weight: 700; color: #30e3ca;">e-Verify</h1>
                        </div>
                    </td>
                </tr>
            </table>
            
            <!-- Hero image -->
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="hero" style="padding: 20px 0; background: #ffffff; text-align: center;">
                        <img src="https://store.suitecrm.com/assets/img/addons/bv-email-verify/logo.png?1579782033" alt="Email Verification" class="hero-image" style="width: 200px; height: auto; margin: 0 auto;">
                    </td>
                </tr>
            </table>
            
            <!-- Content -->
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="content" style="padding: 30px 40px; background: #ffffff; text-align: center;">
                        <h2 style="font-size: 22px; font-weight: 400; margin: 0 0 15px 0; color: #000000;">Kindly confirm your email to complete activation.</h2>
                        <h3 style="font-size: 18px; font-weight: 300; margin: 0 0 15px 0; color: #555555;">Thanks for signing up</h3>
                        <p style="margin: 0 0 15px 0; font-size: 16px; line-height: 1.6; color: #555555;">ABC Co Ltd,</p>
                        <p style="margin: 0 0 15px 0; font-size: 16px; line-height: 1.6; color: #555555;">Your verification code is:</p>
                        
                        <!-- OTP Code -->
                        <div class="otp-code" style="display: inline-block; background: #30e3ca; color: #ffffff; font-size: 24px; font-weight: 700; padding: 15px 30px; margin: 20px 0; border-radius: 5px; letter-spacing: 2px;">
                            ${getEmailCode}
                        </div>
                        
                        <!-- Time limit notice -->
                        <p class="time-limit" style="color: #e74c3c; font-weight: 600; margin: 15px 0; font-size: 16px;">
                            This code is valid for 10 minutes only.
                        </p>
                        
                        <p style="margin: 0 0 15px 0; font-size: 16px; line-height: 1.6; color: #555555;">If you did not request this email, please ignore it.</p>
                    </td>
                </tr>
            </table>
            
            <!-- Footer -->
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="footer" style="padding: 20px 30px; background: #f9f9f9; text-align: center; font-size: 12px; color: #999999; border-top: 1px solid #eeeeee;">
                        <p style="margin: 0; font-size: 12px; color: #999999;">&copy; 2023 ABC Co Ltd. All rights reserved.</p>
                    </td>
                </tr>
            </table>
        </div>
    </center>
</body>
</html>`;
}