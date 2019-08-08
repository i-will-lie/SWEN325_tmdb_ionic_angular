import { User } from "./../models/user";
import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";

@Injectable({
  providedIn: "root"
})
export class UserDatabaseService {
  dbUser;
  dbInfo;
  constructor(private firestore: AngularFirestore) {}

  createNewUser(user: User) {
    var v = this.firestore
      .collection("UserInfo")
      .doc(user.fbUser.email)
      .set(user);

    return v;
  }

  addTmdbUser(fbUserEmail, tmdbUser) {
    console.log("fb", fbUserEmail, "tmdb", tmdbUser);
    this.firestore
      .collection("UserInfo")
      .doc(fbUserEmail)
      .update({ tmdbUser: tmdbUser });
  }

  addTmdbSession(fbUserEmail, sessionID) {
    console.log("updatessid", fbUserEmail, sessionID);
    this.firestore
      .collection("UserInfo")
      .doc(fbUserEmail)
      .update({ sessionID: sessionID });
  }

  dbLogout(fbUserEmail) {
    console.log("logginout", fbUserEmail);
    this.firestore
      .collection("UserInfo")
      .doc(fbUserEmail)
      .update({ sessionID: -1 });

    // this.firestore
    //   .collection("UserInfo")
    //   .doc(fbUserEmail)
    //   .update({ tmdbUser: -1 });
  }

  tmdbLoggedOn(fbUserEmail) {
    console.log("getting");
    console.log(this.dbUser);
    //return res;
  }

  async subscribeToDb(fbUserEmail) {
    console.log("subscribing");
    this.dbUser = await this.firestore
      .collection("UserInfo")
      .doc(fbUserEmail)
      .valueChanges();
    // .subscribe(res => {
    //   this.dbInfo = res;
    // });
    console.log("db ___Uder", this.dbUser);
  }

  updateUsername(fbUserEmail, newName) {
    this.firestore
      .collection("UserInfo")
      .doc(fbUserEmail)
      .update({ username: newName });
  }
  getDbInfo() {
    return this.dbInfo;
  }

  getDbUser() {
    var user;
    this.dbUser;
  }
}
