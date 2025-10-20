import type { CoreService } from "../CoreService";
import type { Request, Response, RequestHandler } from "express";

export type GetParams<Path extends string> = Path extends `/${infer Param}/${infer Rest}`
  ? { [K in Param]: string } & GetParams<Rest>
  : Path extends `/${infer Param}`
  ? { [K in Param]: string }
  : {}; // eslint-disable-line

type MidWareType = {
    get?: RequestHandler[],
    post?: RequestHandler[],
    put?: RequestHandler[],
    patch?: RequestHandler[],
    delete?: RequestHandler[],
}
type paramPath = {
  get?: string;
  post?: string;
  put?: string;
  patch?: string;
  delete?: string;
}

export abstract class RouteHandle {
  abstract readonly path: string;
  protected coreSrv: CoreService;
  constructor(service: CoreService) {
    this.coreSrv = service;
  }

  middlewares?: MidWareType;
  paramPath?: paramPath;


  get?(req: Request, res: Response): Promise<void | unknown>;
  post?(req: Request, res: Response): Promise<void | unknown>;
  put?(req: Request, res: Response): Promise<void | unknown>;
  patch?(req: Request, res: Response): Promise<void | unknown>;
  delete?(req: Request, res: Response): Promise<void | unknown>;

  getParam?(req: Request, res: Response): Promise<void | unknown>;
  postParam?(req: Request, res: Response): Promise<void | unknown>;
  putParam?(req: Request, res: Response): Promise<void | unknown>;
  patchParam?(req: Request, res: Response): Promise<void | unknown>;
  deleteParam?(req: Request, res: Response): Promise<void | unknown>;
}


// Export stuff
export { Main } from "./main";
export { DBSandbox } from "./dbsandbox";