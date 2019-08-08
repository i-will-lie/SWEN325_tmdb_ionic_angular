import { User } from "./../models/user";
import { AuthenticationService } from "./authentication.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Router, NavigationExtras } from "@angular/router";
import { tmdb } from "./../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class FriendsService {
  friendsDb: Observable<any>;
  profileDb;
  constructor(
    private http: HttpClient,
    private afDatabase: AngularFireDatabase,
    private afFirestore: AngularFirestore,
    private auth: AuthenticationService
  ) {}

  findFriends(friendName) {
    this.friendsDb = this.afFirestore
      .collection("UserInfo", ref => ref.where("username", "==", friendName))
      .valueChanges();
    // .subscribe(res => {
    //   console.log("frein res", res, res[0]);
    //   this.userDb = res;
    // });
  }

  getProfile(userEmail) {
    return this.afFirestore
      .collection("UserInfo")
      .doc(userEmail)
      .valueChanges();
  }
}
//
