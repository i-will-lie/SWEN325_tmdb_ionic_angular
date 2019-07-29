import { User } from "./../models/user";
import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";

@Injectable({
  providedIn: "root"
})
export class UserDatabaseService {
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

  logout(fbUserEmail) {
    console.log("logginout");
    this.firestore
      .collection("UserInfo")
      .doc(fbUserEmail)
      .update({ sessionID: "-1" });

    this.firestore
      .collection("UserInfo")
      .doc(fbUserEmail)
      .update({ tmdbUser: null });
  }

  read_Students() {
    return this.firestore.collection("Students").snapshotChanges();
  }

  update_Student(recordID, user) {
    this.firestore.doc("Students/" + recordID).update(user);
  }

  delete_Student(record_id) {
    this.firestore.doc("Students/" + record_id).delete();
  }
}
