/**
 * zhiyan114's Example Mongo Usage with express routes.
 * Please use this to learn and ask questions, not copy and pasting exactly what's here for the project.
 * This file WILL BE deleted before project is finalized
 */

import { RouteHandle } from ".";
import type { Request, Response } from "express";
import { json } from "express";
import { ObjectId } from "mongodb";

// Classic Contact Types
type IcontactInfo = {
    name: string;
    email?: string;
    phoneNumber?: string;
};

type IPOSTReqBody = IcontactInfo[];
type IQueryReq = {
    id?: string;
}

// Index route '/db'
export class Main extends RouteHandle {
  public readonly path = "/db";
  private readonly sandboxDocName = "dbsandbox";

  public readonly middlewares = {
    post: [json({ strict: true })]
  };

  async get(req: Request<void, void, void, IQueryReq>, res: Response<IcontactInfo[]>) {
    const dbDoc = this.coreSrv.database.collection<IcontactInfo>(this.sandboxDocName);

    // Pull one item only if query is provided
    if(req.query.id) {
      const item = await dbDoc.findOne({ _id: new ObjectId(req.query.id) });
      if(!item)
        return res.status(404).json([]);
      return res.json([item]);
    }

    // Returns everything from the collection
    return res.json(await dbDoc.find().toArray());
  }

  async post(req: Request<null, void, IPOSTReqBody>, res: Response<string[]>) {
    // Allow adding an arrays of items to collection
    const body = req.body;
    const dbDoc = this.coreSrv.database.collection<IcontactInfo>(this.sandboxDocName);
    const dbres = await dbDoc.insertMany(body);

    const arrayID: string[] = [];
    for(let i = 0; i < dbres.insertedCount; i++)
      arrayID.push(dbres.insertedIds[i]?.toHexString() ?? "undefined");

    return res.json(arrayID);
  }

}