import type { tokenData } from "@repo/utils/JTWManager.ts";
import { AuthMWGen } from "../middleman";
import { RouteHandle } from "./baseHandle";
import type { Request, Response } from "express";
import { logger } from "@sentry/node";
import type { ICardData, IUserInfo } from "@repo/utils/types";
import { ObjectId, type WithId } from "mongodb";
import { randomInt } from "crypto";

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

type rollHandleResType = string | {
  collections: string[],
  dupCredits: number,
  pulledMinEpic: boolean,
}

type AllCardHandleType = ({id: string} | ICardData)[] | string

export class cardRoute extends RouteHandle {
  public setup() {
    const AuthMW = AuthMWGen(this.coreSrv.database);
    this.coreSrv.webServer.get("/card/:cardID", AuthMW, this.getHandle.bind(this));
    this.coreSrv.webServer.get("/card/summary", AuthMW, this.summaryHandle.bind(this));
    this.coreSrv.webServer.get("/roll/:count", AuthMW, this.rollHandle.bind(this));
    this.coreSrv.webServer.get("/card", this.getAllCardHandle.bind(this));
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

  async getAllCardHandle(req: Request<unknown, unknown, unknown, {onlyID?: string}>, res: Response<AllCardHandleType>) {
    const cardColl = this.coreSrv.database.collection<ICardData>("Cards");
    const getRes = await cardColl.find({}, { projection: { _id: req.query.onlyID ? 1 : undefined } })
      .map(k=>{
        const data = { ...k, id: k._id.toHexString(), _id: undefined };
        delete data._id;
        return data;
      }).toArray();

    logger.info("getAllCard Request has been fulfilled");
    return res.send(getRes);
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

  private async rollHandle(req: Request<{count:string}>, res: Response<rollHandleResType, tokenData>) {
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

    // Save the result stuff into DB and start returning
    const pullRes = rollCard(userData.collection.map(k=>k.toHexString()), await cardColl.find().toArray(), rollCNT, userData.pullsSinceEpic >= 9);
    const updateRes = await userColl.updateOne({ _id: userData._id }, {
      $set: {
        pullsSinceEpic: pullRes.pulledMinEpic ? 0 : undefined
      },
      $addToSet: {
        collection: { $each: pullRes.collections },
      },
      $inc: {
        "currency.gems": pullRes.dupCredits - rollCNT, // credit all the duplicate pulls and debit the rolls
        pullsSinceEpic: (!pullRes.pulledMinEpic) ? 1 : undefined,
      }
    });

    if(!updateRes.acknowledged) {
      logger.error(logger.fmt`${res.locals.id} user roll update was not ack by the database`);
      return res.status(503).send("Database fail to ack roll results");
    }

    if(updateRes.modifiedCount === 0) {
      logger.error(logger.fmt`${res.locals.id} user roll was not updated by the database`, {
        matchCNT: updateRes.matchedCount
      });
      return res.status(500).send("Potential issues preventing user's card roll status from updating???");
    }

    // Finalize to return roll data
    logger.info(logger.fmt`${res.locals.id} successfully completed card pull!`);
    return res.send({
      ...pullRes,
      collections: pullRes.collections.map(k=>k.toHexString())
    });
  }
}



type rollCardReturnT = {
  collections: ObjectId[],
  dupCredits: number,
  pulledMinEpic: boolean;
}

// Handles the main logic to roll cards
function rollCard(userOwned: string[], availableCards: WithId<ICardData>[], rollCnt = 1, guaranteeRare = false): rollCardReturnT {
  // Setup the probability system
  let maxRNGVal = 0;
  const cardProbs = (guaranteeRare ?
    availableCards.filter(k=>k.rarity === "rare" || k.rarity === "legendary") :
    availableCards).map(k=> {
    switch(k.rarity) {
      case "common":
        maxRNGVal += 85;
        break;
      case "rare":
        maxRNGVal += 10;
        break;
      case "epic":
        maxRNGVal += 4;
        break;
      case "legendary":
        maxRNGVal += 1;
        break;
      default:
        throw new cardRoExcept(`Card ${k._id.toHexString()} contains invalid rarity: ${k.rarity}`);
    }

    return {
      _id: k._id,
      rarity: k.rarity,
      chance: maxRNGVal
    };
  }).sort((a,b)=> a.chance - b.chance);

  // Rolling system here
  const data: rollCardReturnT = {
    collections: [],
    dupCredits: 0,
    pulledMinEpic: guaranteeRare
  };

  for(let i=0;i<rollCnt;i++) {
    const pulledCard = cardProbs[BSearch(cardProbs, randomInt(0, maxRNGVal+1))]!; // It's BSearch, the index is guaranteed to exist
    if(["epic", "legendary"].includes(pulledCard.rarity))
      data.pulledMinEpic = true;

    // Card Not Owned
    if(!userOwned.includes(pulledCard._id.toHexString())) {
      data.collections.push(pulledCard._id);
      continue;
    }

    // Card Owned, calculate credits
    switch(pulledCard.rarity) {
      case "common":
        data.dupCredits += 2;
        break;
      case "rare":
        data.dupCredits += 5;
        break;
      case "epic":
        data.dupCredits += 10;
        break;
      case "legendary":
        data.dupCredits += 20;
        break;
      default:
        throw new cardRoExcept(`Card ${pulledCard._id.toHexString()} contains invalid rarity: ${pulledCard.rarity}`);
    }
  }

  return data;
}

// Beloved CS1 Binary Search <3
function BSearch(cards: {_id: ObjectId;chance: number;}[], rollRes: number) {
  let left = 0;
  let right = cards.length;
  while(left < right) {
    const mid = (left + right) >> 1;
    if(cards[mid]!.chance < rollRes) left = mid + 1;
    else right = mid;
  }
  return left < cards.length ? left : -1;
}

// Custom Exceptions

class cardRoExcept extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "cardRoute Exception";
  }
}