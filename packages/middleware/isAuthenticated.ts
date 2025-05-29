import prisma from "@packages/libs/prisma";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken"

const isAuthenticated = async (req: any, res: Response, next: NextFunction) => {
    try {

        const token = req.cookies['access_token'] || req.cookies['seller-access-token'] || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Unauthorized! Token missing ." });
        }

        //verify token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
            id: string,
            role: 'user' | 'seller';
        }

        if (!decoded) {
            return res.status(401).json({
                message: "Unauthorized! Invalid token."
            })
        }

        let account

        if (decoded.role === 'user') {
            account = await prisma.users.findUnique({ where: { id: decoded.id } });
            req.user = account;
        } else if (decoded.role === 'seller') {
            account = await prisma.sellers.findUnique({ where: { id: decoded.id }, include: { Shop: true } })
            req.seller = account;
        }

        if (!account) {
            return res.status(401).json({ Message: "Account not found!" });
        }

        req.role = decoded.role;

        return next();

    } catch (error) {
        return res.status(401).json({ message: "Unauthorized! Token expired or Invalid" });
    }
}

export default isAuthenticated;