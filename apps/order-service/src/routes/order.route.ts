import isAuthenticated from "@packages/middleware/isAuthenticated";
import express, { Router } from "express"
import { createPaymentIntent, createPaymentSession, getAdminOrders, getOrderDetails, getSellerOrders, getUserOrders, updateDeliveryStatus, verifyCouponCode, verifyingPaymentSession } from "../controllers/order.controller";
import { isAdmin, isSeller } from "@packages/middleware/authorizeRoles";

const router: Router = express.Router();

router.post("/create-payment-intent", isAuthenticated, createPaymentIntent);
router.post("/create-payment-session", isAuthenticated, createPaymentSession);
router.get("/verifying-payment-session", isAuthenticated, verifyingPaymentSession);
router.get('/get-seller-orders', isAuthenticated, isSeller, getSellerOrders);
router.get('/get-order-details/:id', isAuthenticated, getOrderDetails);
router.put('/update-status/:orderId', isAuthenticated, isSeller, updateDeliveryStatus);
router.put('/verify-coupon', isAuthenticated, verifyCouponCode);
router.get('/get-user-orders', isAuthenticated, getUserOrders);
router.get('/get-admin-orders', isAuthenticated, isAdmin, getAdminOrders);

export default router;