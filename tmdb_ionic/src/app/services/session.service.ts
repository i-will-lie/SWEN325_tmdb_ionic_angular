import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class SessionService {
  email;
  username;
  accountID;
  sessionID = -1;
  favouriteListID;
  constructor() {}

  OnInit() {}
}
