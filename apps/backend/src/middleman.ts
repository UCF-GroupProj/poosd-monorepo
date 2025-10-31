import type { Request, Response, NextFunction } from "express";
export function checkAuth(req: Request, res: Response, next: NextFunction) {
  next();
}