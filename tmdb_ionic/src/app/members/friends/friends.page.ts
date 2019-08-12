import { NavController } from "@ionic/angular";
import { UserDatabaseService } from "./../../services/user-database.service";
import { Friend } from "./../../models/friend";
import { SessionService } from "./../../services/session.service";
import { FriendsService } from "./../../services/friends.service";
import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import { MenusService } from "../../services/menus.service";

@Component({
  selector: "app-friends",
  templateUrl: "./friends.page.html",
  styleUrls: ["./friends.page.scss"]
})
export class FriendsPage implements OnInit {
  searchFriend: string = "";
  friendResult;
  currentFriends = [];
  searchSub;
  constructor(
    private friendServ: FriendsService,
    private afStore: AngularFirestore,
    private sessionServ: SessionService,
    public menu: MenusService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    // this.friendServ.setFriends().subscribe(res => {
    //   if (res["friends"]) {
    //     this.currentFriends = res["friends"];
    //   } else {
    //     this.currentFriends = [];
    //   }
    // });
  }

  async searchChanged() {
    // this.result = await this.friendService.findFriends(this.searchFriend);
    // this.friendService.userDb.valueChanges().subscribe(res => {
    //   console.log("frein res", res, res[0]);
    //   this.result = res;
    // });
    this.searchSub = await this.afStore
      .collection("UserInfo", ref =>
        ref.where("tmdbUser.username", "==", this.searchFriend)
      )
      .valueChanges()
      .subscribe(res => {
        // console.log("frein res", res, res[0]);
        if (res[0]) {
          this.friendResult = res[0];
        } else {
          this.friendResult = null;
        }
      });
    //console.log(this.result, "res");
  }
  addFriend(email, username, accountID, favouriteID) {
    //console.log("add friend", email, username, accountID);
    if (email == this.sessionServ.email) {
      this.menu.presentAlert("You Can't Friend Yourself");
    } else {
      this.friendServ.addFriend(email, username, accountID, favouriteID);
      this.menu.presentToast("Friend added: " + username);
    }
  }

  getCurrentFriends() {
    //console.log("c friends", this.friendServ.currentFriends);
    const friend = this.friendServ.currentFriends;
    if (friend[0]) {
      //console.log("found", friend[0]["email"]);
      return friend;
    }
    return [];
  }
  goBack() {
    this.navCtrl.pop();
  }
}
