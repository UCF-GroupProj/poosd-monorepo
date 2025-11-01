import { captureException } from "@sentry/node";
import type { Request, Response, NextFunction } from "express";
import { JWTManager } from "@repo/utils/JTWManager.ts";
import { logger } from "@sentry/node";
import { randomUUID } from "crypto";

export function checkAuth(req: Request, res: Response, next: NextFunction) {
  // Validate Token Header
  if(!req.headers.authorization)
    return res.status(401).send("Missing Authorization Header");

  const [TokenType, Token] = req.headers.authorization.split(" ");
  if(TokenType !== "Bearer")
    return res.status(401).send("Invalid token type found! Maybe you forgot to include 'Bearer' prefix or used the wrong prefix?");
  if(!Token)
    return res.status(401).send("Missing Actual Token...");

  const JWTMGR = new JWTManager();
  try {
    const data = JWTMGR.verifyUserKey(Token);
  } catch(ex) {
    if(ex instanceof Error) {
      /* Handle bad JWT Keys */
      const referenceID = randomUUID();
      if(ex.name === "TokenExpiredError") {
        logger.warn(logger.fmt`${JWTMGR.decodeUserKey(Token)?.id} is using expired token. This shouldn't happen as JWT doesn't have expired flag`, { referenceID });
        return res.status(403).send(`AUTH TOKEN EXPIRED. Developer Ref ID: ${referenceID}`);
      }

      if(ex.name === "NotBeforeError") {
        logger.warn(logger.fmt`${JWTMGR.decodeUserKey(Token)?.id} is using pre-valid token. This shouldn't happen unless something is wrong with the server clock`, { referenceID });
        return res.status(403).send(`AUTH TOKEN NOT YET VALID. Developer Ref ID: ${referenceID}`);
      }

      if(ex.name === "JsonWebTokenError") {
        logger.warn(logger.fmt`An error occured when processing JWT Key: ${ex.message}`, { referenceID });
        return res.status(401).send(`Your session key is bad. Developer Ref ID: ${referenceID}`);
      }
    }
    captureException(ex);
  }
  next();
}