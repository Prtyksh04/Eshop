import express, { Router } from "express";
import { createShop, createStripeConnectLink, getSeller, getUser, loginSeller, loginUser, refreshToken, registerSeller, resetUserPassword, userForgotPassword, userRegistration, verifySeller, verifyUser, verifyUserForgotPassword } from "../controller/auth.controller";
import isAuthenticated from "@packages/middleware/isAuthenticated";
import { isSeller } from "@packages/middleware/authorizeRoles";


const router: Router = express.Router();

router.post('/user-registration', userRegistration);
router.post('/verify-user', verifyUser);
router.post('/login-user', loginUser);
router.post('/refresh-token', refreshToken);
router.get('/logged-in-user', isAuthenticated, getUser);
router.post('/forgot-password-user', userForgotPassword);
router.post('/reset-password-user', resetUserPassword);
router.post('/verify-forgot-password-user', verifyUserForgotPassword);
router.post('/seller-registration', registerSeller);
router.post('/verify-seller', verifySeller);
router.post('/create-shop', createShop);
router.post('/create-stripe-link', createStripeConnectLink);
router.post('/login-seller', loginSeller);
router.get('/logged-in-seller',isAuthenticated,isSeller ,getSeller);


export default router;