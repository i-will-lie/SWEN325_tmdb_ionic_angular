import { NavController } from "@ionic/angular";
import { SessionService } from "./../../services/session.service";
import { FriendsService } from "./../../services/friends.service";
import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { MenusService } from "../../services/menus.service";

@Component({
  selector: "app-friends",
  templateUrl: "./friends.page.html",
  styleUrls: ["./friends.page.scss"]
})
/**
 * Page functionaliity for finding users and displaying friends.
 */
export class FriendsPage implements OnInit {
  searchFriend: string = ""; //target user
  friendResult; //search result
  currentFriends = []; //friends of current user
  searchSub; //subscription to search result

  constructor(
    private friendServ: FriendsService,
    private afStore: AngularFirestore,
    private sessionServ: SessionService,
    public menu: MenusService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {}

  /**
   * Searches the firebase database for user with the currently given name.
   * Assigns the result to the field to allow it to be displayed.
   */
  async searchChanged() {
    this.searchSub = await this.afStore
      .collection("UserInfo", ref =>
        ref.where("tmdbUser.username", "==", this.searchFriend)
      )
      .valueChanges()
      .subscribe(res => {
        //friend is found if the result is not current user
        if (
          res[0] &&
          res[0]["tmdbUser"]["username"] != this.sessionServ.username
        ) {
          this.friendResult = res[0];
        } else {
          this.friendResult = null;
        }
      });
  }
  // /**

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
