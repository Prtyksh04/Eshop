import { isAdmin } from "@packages/middleware/authorizeRoles";
import isAuthenticated from "@packages/middleware/isAuthenticated";
import express, { Router } from "express";
import { getAllProducts } from "../controllers/admin.controller";

const router: Router = express.Router();

router.get('/get-all-products', isAuthenticated, isAdmin, getAllProducts);

export default router;