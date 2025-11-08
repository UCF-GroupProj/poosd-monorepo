import { RouteHandle } from "./baseHandle";
import type { Request, Response } from "express";

export class Main extends RouteHandle {
  public setup() {
    this.coreSrv.webServer.get("/profile", this.profileHandle.bind(this));
  }

  async profileHandle(req: Request, res: Response) {
    return res.send("Hello World! :3");
  }
}