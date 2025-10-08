import type { Request, Response, NextFunction } from "express"
import {v4 as uuidv4 } from "uuid";


export const assignVisitorId = (req: Request, res: Response, next: NextFunction
) => {
  if (!req.cookies.visitorId) {
    const visitorId = uuidv4()

    res.cookie("visitorId", visitorId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    })
  }
  next();
}