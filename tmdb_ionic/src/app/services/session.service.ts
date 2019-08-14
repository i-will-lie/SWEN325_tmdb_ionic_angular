import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
/**
 * Service to keep track of detail pertaining to the curent session.
 */
export class SessionService {
  email: string;
  username: string;
  accountID: number | string;
  sessionID = -1;
  favouriteListID: number;
  constructor() {}

  OnInit() {}
}
