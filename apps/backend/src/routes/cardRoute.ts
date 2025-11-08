import type { tokenData } from "@repo/utils/JTWManager.ts";
import { AuthMWGen } from "../middleman";
import { RouteHandle } from "./baseHandle";
import type { Request, Response } from "express";

export class Main extends RouteHandle {
  public setup() {
    this.coreSrv.webServer.get("/card/:cardID", AuthMWGen(this.coreSrv.database), this.getHandle.bind(this));
    this.coreSrv.webServer.get("/card/summary", AuthMWGen(this.coreSrv.database), this.summaryHandle.bind(this));
  }

  async getHandle(req: Request<{cardID: string}>, res: Response<unknown, tokenData>) {
    return res.send("Hello World! :3");
  }

  async summaryHandle(req: Request, res: Response<unknown, tokenData>) {
    return res.send("Hello World! :3");
  }
}