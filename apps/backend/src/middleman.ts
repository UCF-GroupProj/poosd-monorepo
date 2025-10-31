import type { Request, Response, NextFunction } from "express";
export function checkAuth(req: Request, res: Response, next: NextFunction) {
  // Validate Token Header
  if(!req.headers.authorization)
    return res.status(401).send("Missing Authorization Header");

  const [TokenType, Token] = req.headers.authorization.split(" ");
  if(TokenType !== "Bearer")
    return res.status(401).send("Invalid token type found! Maybe you forgot to include 'Bearer' prefix?");
  if(!Token)
    return res.status(401).send("Missing Actual Token...");
  next();
}