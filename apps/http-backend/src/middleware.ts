
import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "@repo/backend-common/config";
import jwt from "jsonwebtoken";

export function middleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Missing or invalid Authorization header",
    });
  }

  // Extract the actual JWT, removing "Bearer "
  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded === "string" || !decoded.userId) {
      return res.status(401).json({
        message: "Invalid token payload",
      });
    }

    req.userId = decoded.userId as string;
    next();
  } catch (error) {
    console.error("JWT verification failed:", error);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}
