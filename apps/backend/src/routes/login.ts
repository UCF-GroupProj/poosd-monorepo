import { RouteHandle } from ".";
import type { Request, Response } from "express";
import { json } from "express";
import { ObjectId } from "mongodb";



type IUserInfo = {
    _id : ObjectId, 
    verified : boolean,
    collection : Array<string>,
    level : number,
    exp : number,
    currency : object
}

type ILogInReqBody = { 
    email: string, 
    password: string
}

export class LogIn extends RouteHandle {

    private logInDocName = "login";

    public setup() {
        const webSRV = this.coreSrv.webServer;
        webSRV.route("/login")
        .post(json({ strict: true }), this.postLogIn.bind(this));
    }

     private async postLogIn(req: Request<unknown, void, ILogInReqBody>, res: Response<string>) {
        const body = req.body;

        if(!body.email || !body.password) 
            return res.status(400).send("Missing required fields");

        const logInDoc = this.coreSrv.database.collection<IUserInfo>(this.logInDocName);
        const user = await logInDoc.findOne({ email : body.email, password : body.password });

        if(!user)
            return res.status(401).send("Invalid email or password");

        if(!user.verified)
            return res.status(403).send("Email verification required")
        
        return res.status(200).send("Login successful");
     }
}