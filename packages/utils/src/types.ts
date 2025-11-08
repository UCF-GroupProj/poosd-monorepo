// GLOBAL TYPES
import type { ObjectId } from "mongodb";

/* Database Types */
export type mongoID = {_id : ObjectId};

// Users Collection
export type IUserCred = {
    email: string;
    password: string;
}
export type IUserInfo = {
    verified: boolean,
    collection: Array<ObjectId>,
    level: number,
    exp: number,
    currency: {
      gems: number
    },
    favorites: ObjectId[],
    pullsSinceEpic: number,
    lastPullTime: Date,
}
export type IUserDBObject = IUserInfo & IUserCred;
export type IFulluserInfo = IUserInfo & mongoID
export type IStoredUser = IUserDBObject & mongoID;

// Session State
export type ISessionState = {
  userId: ObjectId;
  userToken: string; // SHA256 hashed
  lastLogin: Date;
}

// Account Requests
export type IAccountRequest = {
  userId: ObjectId,
  requestId: string; // Random hex string
  createdAt: Date;
  requestType: "password" | "email";
}

// Card Data
export type ICardData = {
  name: string,
  rarity: string,
  description: string,
  imageUrl: string,
}