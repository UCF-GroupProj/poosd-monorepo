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

type IcontactPatch = {
    name?: string;
    email?: string;
    phoneNumber?: string;
};

// Index route '/db'

export class DBSandbox extends RouteHandle {
  public readonly path = "/db";
  private sandboxDocName = "dbsandbox";

  public readonly middlewares = {
    post: [json({ strict: true })]
  };

  public readonly paramPath = {
    get: ":id",
    patch: ":id",
    delete: ":id"
  };

  async get(req: Request<unknown, void, void>, res: Response<IcontactInfo[]>) {
    const dbDoc = this.coreSrv.database.collection<IcontactInfo>(this.sandboxDocName);

    // Returns everything from the collection
    return res.json(await dbDoc.find().toArray());
  }

  async getParam(req: Request<{id: string}>, res: Response<IcontactInfo | string>) {
    const dbDoc = this.coreSrv.database.collection<IcontactInfo>(this.sandboxDocName);
    const item = await dbDoc.findOne({ _id: new ObjectId(req.params.id) });
    if(!item)
      return res.status(404).json("No Response");
    return res.json(item);
  }

  async post(req: Request<unknown, void, IPOSTReqBody>, res: Response<string[]>) {
    // Allow adding an arrays of items to collection
    const body = req.body;
    const dbDoc = this.coreSrv.database.collection<IcontactInfo>(this.sandboxDocName);
    const dbres = await dbDoc.insertMany(body);

    const arrayID: string[] = [];
    for(let i = 0; i < dbres.insertedCount; i++)
      arrayID.push(dbres.insertedIds[i]?.toHexString() ?? "undefined");

    return res.json(arrayID);
  }

  async patchParam(req: Request<{id: string}, void, IcontactPatch>, res: Response<string>) {
    const dbDoc = this.coreSrv.database.collection<IcontactInfo>(this.sandboxDocName);
    const pRES = await dbDoc.updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body }, { upsert: false });

    if(pRES.matchedCount === 0)
      return res.status(404).send("No Document found!");

    if(pRES.modifiedCount === 0)
      return res.status(500).send("DOCUMENT NOT UPDATED??");

    return res.send("DONE");
  }

  async deleteParam(req: Request<{id: string}, void, void>, res: Response<string>) {
    const dbDoc = this.coreSrv.database.collection<IcontactInfo>(this.sandboxDocName);
    const dRes = await dbDoc.deleteOne({ _id: new ObjectId(req.params.id) });

    if(dRes.deletedCount === 0)
      return res.status(404).send("No Document found!");

    return res.send("DONE!");
  }

}