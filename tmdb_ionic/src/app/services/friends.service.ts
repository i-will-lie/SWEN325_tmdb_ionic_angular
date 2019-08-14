import { Friend } from "./../models/friend";
import { SessionService } from "./session.service";
import { User } from "./../models/user";
import { AuthenticationService } from "./authentication.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, filter } from "rxjs/operators";
import { Router, NavigationExtras } from "@angular/router";
import { tmdb } from "./../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class FriendsService {
  friendsDb: Observable<any>;
  profileDb;
  friendSub;
  currentFriends;
  constructor(
    private http: HttpClient,
    private afDatabase: AngularFireDatabase,
    private afFirestore: AngularFirestore,
    private auth: AuthenticationService,
    private sessionServ: SessionService
  ) {}

  async ngOnInit() {}

  async initFriends() {
    console.log("fri serv init");
    this.friendSub = await this.setFriends();
    this.friendsDb.subscribe(res => {
      if (res["friends"]) {
        console.log("have friends");
        this.currentFriends = res["friends"];
      } else {
        console.log("NO friends");
        this.currentFriends = [];
      }
    });
  }
  setFriends() {
    console.log("setting friends");
    this.friendsDb = this.afFirestore
      .collection("UserInfo")
      .doc(this.sessionServ.email)
      .valueChanges();
    // .subscribe(res => {
    //   console.log("frein res", res, res[0]);
    //   this.userDb = res;
    // });
    return this.friendsDb;
  }

  addFriend(email, username, accountID, favouriteID): boolean {
    if (this.haveFriend(email)) {
      return false;
    }
    const newFriend: Friend = {
      email: email,
      username: username,
      accountID: accountID,
      favouriteID: favouriteID
    };
    if (this.currentFriends == [] || this.currentFriends == null) {
      console.log("c friend", []);
      this.updateFriends(newFriend);
    } else {
      const friends = this.currentFriends.slice();
      friends.push(newFriend);
      console.log("c friend", friends);
      this.updateFriends(friends);
    }
    return true;
  }

  getFriends() {
    return this.currentFriends;
  }
  getProfile(userEmail) {
    return this.afFirestore
      .collection("UserInfo")
      .doc(userEmail)
      .valueChanges();
  }

  updateFriends(newFriends) {
    this.afFirestore
      .collection("UserInfo")
      .doc(this.sessionServ.email)
      .update({ friends: newFriends });
  }

  removeFriend(email): boolean {
    //check if have friend
    if (!this.haveFriend(email)) {
      return false;
    }

    //get current friends list
    const newFriends = this.currentFriends.filter(friend => {
      return friend["email"] != email;
    });
    console.log("new remove friends", newFriends);
    //remove item from fiend list
    //update friend list
    this.afFirestore
      .collection("UserInfo")
      .doc(this.sessionServ.email)
      .update({ friends: newFriends });
    return true;
  }

  haveFriend(email) {
    //console.log("have friend", this.currentFriends);
    var result = this.currentFriends.map(friend => {
      return friend["email"];
    });

    //console.log("map friend", result.includes(email));
    return result.includes(email);
  }

  getUsernameFromID(accID) {
    console.log("hfggfh ");
    var v = this.currentFriends.filter(friend => {
      return friend.accountID == accID;
    }).username;

    console.log("nnnnnnnnnnnnnnnnn ", v);
    return v;
  }
  logout() {
    this.profileDb.unsubscribe();
    this.friendSub.unsubscribe();
    //this.friendsDb.unsubscribe();
  }
}
//
