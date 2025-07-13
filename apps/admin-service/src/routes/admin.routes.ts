import { isAdmin } from "@packages/middleware/authorizeRoles";
import isAuthenticated from "@packages/middleware/isAuthenticated";
import express, { Router } from "express";
import { addNewAdmin, getAllAdmins, getAllCustomizations, getAllEvents, getAllProducts, getAllSellers, getAllUsers } from "../controllers/admin.controller";

const router: Router = express.Router();

router.get('/get-all-products', isAuthenticated, isAdmin, getAllProducts);
router.get('/get-all-events', isAuthenticated, isAdmin, getAllEvents);
router.get('/get-all-admins', isAuthenticated, isAdmin, getAllAdmins);
router.put('/add-new-admin', isAuthenticated, isAdmin, addNewAdmin);
router.get('/get-all-users', isAuthenticated, isAdmin, getAllUsers);
router.get('/get-all-sellers', isAuthenticated, isAdmin, getAllSellers);
router.get('/get-all', getAllCustomizations);

export default router;