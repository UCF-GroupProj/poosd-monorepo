// GLOBAL TYPES
import type { ObjectId } from "mongodb";

/* Database Types */

// Users Collection
export type IUserCred = {
    email: string;
    password: string;
}
export type IUserInfo = {
    verified : boolean,
    collection : Array<string>,
    level : number,
    exp : number,
    currency : {
      gems: number
    },
    favorites: ObjectId[]
}
export type IUserDBObject = IUserInfo & IUserCred;
export type IFulluserInfo = IUserInfo & {_id : ObjectId}
export type IStoredUser = IUserDBObject & { _id: ObjectId };