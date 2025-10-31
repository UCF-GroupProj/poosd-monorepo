import { type JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import type { tokenData } from "./types";

export class JWTManager {
  private signKey: string;
  /**
     * Please use JTW_KEY env instead
     */
  constructor(key?: string) {
    key = process.env["JWT_KEY"] ?? key;
    if(!key)
      throw new JWTError("Missing JTW signing key ENVIRONMENT 'JWT_KEY' or construction param.");
    this.signKey = key;
  }

  public signUserKey(user: tokenData) {
    return jwt.sign({ sub: user.id, email: user.email }, this.signKey, { algorithm: "HS512" });
  }

  public verifyUserKey(token: string) {
    const keyContent = jwt.verify(token, this.signKey, { algorithms: ["HS512"] }) as JwtPayload & {email: string};
    return {
      id: keyContent.sub,
      email: keyContent.email,
    };
  }
}

class JWTError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "JWT Error";
  }
}