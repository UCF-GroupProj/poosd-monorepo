import type { tokenData } from "@repo/utils/JTWManager.ts";
import { AuthMWGen } from "../middleman";
import { RouteHandle } from "./baseHandle";
import type { Request, Response } from "express";
import type { IUserInfo } from "@repo/utils/types";
import { logger } from "@sentry/node";
import { ObjectId } from "mongodb";

type getReturnType = string | {
  id: string,
  verified: boolean,
  collection: string[], // ObjectID
  level: number,
  exp: number,
  currency: {
    gems: number
  },
  favorites: string[], // ObjectID
  pullsSinceEpic: number,
  lastPullTime: string, // Date
}

type patchReqType = {
  collections?: string[],
  incCurrency?: number
}

export class UserProfile extends RouteHandle {
  public setup() {
    this.coreSrv.webServer.route("/profile")
      .all(AuthMWGen(this.coreSrv.database))
      .get(this.getHandle.bind(this))
      .patch(this.patchHandle.bind(this));
  }

  private async getHandle(req: Request, res: Response<getReturnType, tokenData>) {
    const userColl = this.coreSrv.database.collection<IUserInfo>("Users");

    logger.debug(logger.fmt`Pulling user data for ${res.locals.id}`);
    const userData = await userColl.findOne({ _id: new ObjectId(res.locals.id) },
      {
        projection: {
          email: 0,
          password: 0
        }
      }
    );
    if(!userData) {
      logger.error(logger.fmt`User ${res.locals.id} not found in the database`);
      return res.status(500).send("User missing from database??");
    }

    // Format the response
    const responseData = {
      id: userData._id.toHexString(),
      ...userData,
      collection: userData.collection.map(k=>k.toHexString()),
      favorites: userData.favorites.map(k=>k.toHexString()),
      lastPullTime: userData.lastPullTime.toISOString(),
    };
    // @ts-expect-error userData inherit _id, which is unwanted but TS complains because type stuff LOL
    delete responseData._id;

    logger.info(logger.fmt`User ${res.locals.id} data request successfully processed`);
    return res.send(responseData);
  }

  private async patchHandle(req: Request<unknown, unknown, patchReqType>, res: Response<string, tokenData>) {
    const userColl = this.coreSrv.database.collection<IUserInfo>("Users");

    const userData = await userColl.findOne({ _id: new ObjectId(res.locals.id) });
    if(!userData) {
      logger.error(logger.fmt`${res.locals.id} token is valid BUT user doesn't exist in the database??`);
      return res.status(500).send("User object doesn't exist in DB but you have valid token??");
    }

    if(req.body.collections) {
      const existSet = new Set<string>(userData.collection.map(k=>k.toHexString()));
      const newSet = new Set<string>(req.body.collections);
      req.body.collections = Array.from(existSet.symmetricDifference<string>(newSet));
    }

    if(req.body.incCurrency && req.body.incCurrency < 0) {
      logger.warn(logger.fmt`incCurrency for ${res.locals.id} is valued below 0 (not allowed), setting value back to 0`);
      req.body.incCurrency = 0;
    }

    const updateRes = await userColl.updateOne({ _id: userData._id }, {
      $set: {
        collection: req.body.collections?.map(k=>new ObjectId(k))
      },
      $inc: {
        "currency.gems": req.body.incCurrency
      }
    });
    if(!updateRes.acknowledged) {
      logger.error(logger.fmt`Database didnt ack while updating record for ${res.locals.id}`);
      return res.status(503).send("Database fail to respond correctly!");
    }
    if(updateRes.modifiedCount === 0) {
      logger.warn(logger.fmt`No record has been updated for ${res.locals.id}`, {
        matchCnt: updateRes.matchedCount
      });
      return res.status(400).send("No record has been updated, could be an internal issue if the body isnt empty!");
    }

    logger.info(logger.fmt`User Record updated for ${res.locals.id}`, {
      bodyData: req.body
    });
    return res.send("User Request Successfully Processed");
  }
}