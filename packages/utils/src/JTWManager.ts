import { sign, verify } from "jsonwebtoken";


type userData = {
    id: string
}

export class JWTManager {
  private signKey: string;
  /**
     * Please use JTW_KEY env instead
     */
  constructor(key?: string) {
    this.signKey = process.env["JWT_KEY"] ?? key;
    if(!this.signKey)
      throw new JWTError("Missing JTW signing key ENVIRONMENT 'JWT_KEY' or construction param.");
  }

  public signUserKey(user: userData) {
    return sign({ id: user.id }, this.signKey, { algorithm: "HS512" });
  }

  public verifyUserKey(token: string) {
    return verify(token, this.signKey, { algorithms: ["HS512"] });
  }
}

class JWTError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "JWT Error";
  }
}