import { TmdbUser } from "./../models/tmdbUser";
import { FbUser } from "./../models/fbUser";
import { Injectable } from "@angular/core";
//import { Session } from "../models/user";

@Injectable({
  providedIn: "root"
})
export class SessionService {
  //private session: Session;
  constructor() {}

  setSession(fbUser: FbUser, tmdbUser: TmdbUser, sessionID: number) {
    // this.session.fbUser = fbUser;
    // this.session.tmdbUser = tmdbUser;
    // this.session.sessionID = sessionID;
  }
}
