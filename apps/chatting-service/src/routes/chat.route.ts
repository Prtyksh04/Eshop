import isAuthenticated from "@packages/middleware/isAuthenticated";
import express from "express";
import { fetchMessages, fetchSellerMessages, getSellerConversations, getUserConversations, newConversation } from "../controller/chatting-controller";
import { isSeller } from "@packages/middleware/authorizeRoles";

const router = express.Router();

router.post("/create-user-conversationGroup", isAuthenticated, newConversation);
router.get("/get-user-conversations", isAuthenticated, getUserConversations);
router.get("/get-seller-conversations", isAuthenticated, isSeller, getSellerConversations);
router.get("/get-messages/:conversationId", isAuthenticated, fetchMessages);
router.get("/get-seller-messages/:conversationId", isAuthenticated, fetchSellerMessages);

export default router;