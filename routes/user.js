import express from 'express';
const router = express.Router();

import { isAuthenticatedUser, authorizeRoles } from '../middlewares/auth.js';
import {
    register, authRegister, authLinkedInRegister, login, getAllUsers, deleteUser, updateUser, getUserDetails, logout,
    emailVerification, mobileVerification, forgotPassword, verifyEmailOtp, verifyMobileOtp,
    generate2FA, verify2FA,
    authGoogleRegister, authGithub, authGithubRegister, authFacebookRegister, authTwitterRegister, authInstagramRegister
} from '../controller/authHandler.js';


router.route('/user-profile').get(isAuthenticatedUser, getUserDetails);
router.route('/me').get(isAuthenticatedUser, getUserDetails);
router.route('/login').post(login);
router.route('/register').post(register); // userid password
router.route('/logout').get(isAuthenticatedUser, logout);
router.route('/user').get(isAuthenticatedUser, authorizeRoles('admin'), getAllUsers);
router.route('/update/:id').put(isAuthenticatedUser, authorizeRoles('admin'), updateUser)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser);


router.route('/saveUser').post(authRegister);  //google twtter facebook git

router.route('/verification/email').post(emailVerification);
router.route('/verification/sms').post(mobileVerification);
router.route('/forgot-password').post(forgotPassword);

router.route('/verify-email').post(verifyEmailOtp);
router.route('/verify-mobile').post(verifyMobileOtp);


router.route('/generate2FA').get(generate2FA);
router.route('/verify2FA').post(verify2FA);


router.post('/linkedin', authLinkedInRegister);
router.post('/google', authGoogleRegister);
router.get('/github', authGithub);
router.get('/github/callback', authGithubRegister);
router.get('/facebook/callback', authFacebookRegister);
router.get('/twitter/callback', authTwitterRegister);
router.post('/instagram', authInstagramRegister);

export default router;
