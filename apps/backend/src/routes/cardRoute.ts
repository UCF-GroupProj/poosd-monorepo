import type { tokenData } from "@repo/utils/JTWManager.ts";
import { AuthMWGen } from "../middleman";
import { RouteHandle } from "./baseHandle";
import type { Request, Response } from "express";
import { logger } from "@sentry/node";
import type { ICardData, IUserInfo } from "@repo/utils/types";
import { ObjectId } from "mongodb";

type getHandleResType = string | ICardData & {
  id: string,
  owned: boolean,
}

type summaryHandleResType = string | {
  totalUniqueCards: number,
  commonOwned: number,
  rareOwned: number,
  epicOwned: number,
  legendaryOwned: number
}

export class Main extends RouteHandle {
  public setup() {
    const AuthMW = AuthMWGen(this.coreSrv.database);
    this.coreSrv.webServer.get("/card/:cardID", AuthMW, this.getHandle.bind(this));
    this.coreSrv.webServer.get("/card/summary", AuthMW, this.summaryHandle.bind(this));
    this.coreSrv.webServer.get("/roll/:count", AuthMW, this.rollHandle.bind(this));
  }

  async getHandle(req: Request<{cardID: string}>, res: Response<getHandleResType, tokenData>) {
    const userColl = this.coreSrv.database.collection<IUserInfo>("Users");
    const cardColl = this.coreSrv.database.collection<ICardData>("Cards");

    // Pull card data
    logger.debug(logger.fmt`Pulling card info for ${req.params.cardID}`);
    const cardData = await cardColl.findOne({ _id: new ObjectId(req.params.cardID) });
    if(!cardData) {
      logger.warn(logger.fmt`Card ${req.params.cardID} doesn't exist`);
      return res.status(404).send("Card id doesn't exist in the database");
    }

    // Confirm ownership
    logger.debug(logger.fmt`Check card (${req.params.cardID}) ownership for ${res.locals.id}`);
    const userCards = (await userColl.findOne({ _id: new ObjectId(res.locals.id), collection: cardData._id }));
    if(!userCards)
      logger.debug(logger.fmt`${res.locals.id} doesn't own card ${req.params.cardID}`);

    const responseData: getHandleResType = {
      id: cardData._id.toHexString(),
      ...cardData,
      owned: userCards !== null,
    };
    // @ts-expect-error cardData inherit _id, which is unwanted but TS complains because type stuff LOL
    delete responseData._id;

    logger.info(logger.fmt`${res.locals.id} card request for ${req.params.cardID} completed!`);
    return res.send(responseData);
  }

  async summaryHandle(req: Request, res: Response<summaryHandleResType, tokenData>) {
    const userColl = this.coreSrv.database.collection<IUserInfo>("Users");
    const cardColl = this.coreSrv.database.collection<ICardData>("Cards");

    // Get user card collections
    const userCollections = (await userColl.findOne({ _id: new ObjectId(res.locals.id) }))?.collection;
    if(!userCollections) {
      logger.error(logger.fmt`User ${res.locals.id} potentially not found for cardRoute operation??`);
      return res.status(500).send("User cant be found in the database??");
    }

    // Pull all cards that's owned by the user
    const cardsInfoCur = cardColl.find({ _id: { $in: userCollections } });
    const returnData: summaryHandleResType = {
      "totalUniqueCards": 0,
      "commonOwned": 0,
      "rareOwned": 0,
      "epicOwned": 0,
      "legendaryOwned": 0
    };

    for await (const card of cardsInfoCur) {
      returnData.totalUniqueCards++;
      switch(card.rarity) {
        case "common":
          returnData.commonOwned++;
          break;
        case "epic":
          returnData.epicOwned++;
          break;
        case "rare":
          returnData.rareOwned++;
          break;
        case "legendary":
          returnData.legendaryOwned++;
          break;
        default:
          logger.error(logger.fmt`Card ${card.name} (${card._id.toHexString()}) contains invalid rarity data: ${card.rarity}`);
      }
    }

    logger.info(logger.fmt`Successfully generate user (${res.locals.id}) card summary`);
    return res.send(returnData);
  }

  private async rollHandle(req: Request<{count:string}>, res: Response<string, tokenData>) {
    const userColl = this.coreSrv.database.collection<IUserInfo>("Users");
    const cardColl = this.coreSrv.database.collection<ICardData>("Cards");

    // Param Validation
    if(req.params.count !== "1" && req.params.count !== "10")
      return res.status(400).send("You can only roll either 1 or 10");
    const rollCNT = Number.parseInt(req.params.count);

    // Validate User Balance
    const userData = await userColl.findOne({ _id: new ObjectId(res.locals.id) });
    if(!userData) {
      logger.error(logger.fmt`${res.locals.id} user attempts to roll card but user object not in the database??`);
      return res.status(500).send("Missing User Object From DB");
    }
    if(userData.currency.gems < rollCNT) {
      logger.info(logger.fmt`${res.locals.id} user attempts to roll with insufficient fund`, {
        rollCNT,
        balance: userData.currency.gems
      });
      return res.status(403).send(`Insuffient gems to roll a ${rollCNT}`);
    }
  }
}