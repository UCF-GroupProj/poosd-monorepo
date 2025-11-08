import type { tokenData } from "@repo/utils/JTWManager.ts";
import { AuthMWGen } from "../middleman";
import { RouteHandle } from "./baseHandle";
import type { Request, Response } from "express";

export class Main extends RouteHandle {
  public setup() {
    this.coreSrv.webServer.get("/profile", AuthMWGen(this.coreSrv.database), this.profileHandle.bind(this));
  }

  async profileHandle(req: Request, res: Response<unknown, tokenData>) {
    return res.send("Hello World! :3");
  }
}