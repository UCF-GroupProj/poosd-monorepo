import type { CoreService } from "../CoreService";
import type { Request, Response, RequestHandler } from "express";

type MidWareType = {
    get?: RequestHandler[],
    post?: RequestHandler[],
    put?: RequestHandler[],
    patch?: RequestHandler[],
    delete?: RequestHandler[],
}

export abstract class RouteHandle {
  abstract readonly path: string;
  protected coreSrv: CoreService;
  constructor(service: CoreService) {
    this.coreSrv = service;
  }

  middlewares?: MidWareType;
  getParamPath?: string;
  postParamPath?: string;
  putParamPath?: string;
  patchParamPath?: string;
  deleteParamPath?: string;

  get?(req: Request<unknown, void, unknown, unknown>, res: Response): Promise<void | unknown>;
  post?(req: Request<unknown, void, unknown, unknown>, res: Response): Promise<void | unknown>;
  put?(req: Request<unknown, void, unknown, unknown>, res: Response): Promise<void | unknown>;
  patch?(req: Request<unknown, void, unknown, unknown>, res: Response): Promise<void | unknown>;
  delete?(req: Request<unknown, void, unknown, unknown>, res: Response): Promise<void | unknown>;
}


// Export stuff
export { Main } from "./main";