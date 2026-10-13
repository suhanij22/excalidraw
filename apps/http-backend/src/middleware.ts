import {Request,Response,NextFunction } from "express";
import { JWT_SECRET } from "@repo/backend-common/config";
import jwt, { decode } from "jsonwebtoken";

export function middleware(req:Request,res:Response,next:NextFunction)
{
    const token =req.headers["authorization"]??"";
    const decoded= jwt.verify(token,JWT_SECRET);

    if (typeof decoded === "string" || !decoded.userId) {
    return res.status(401).json({
        message: "Unauthorized"
    });
}

req.userId = decoded.userId as string;
next();
}