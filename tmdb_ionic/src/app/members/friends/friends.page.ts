import { FriendsService } from "./../../services/friends.service";
import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
@Component({
  selector: "app-friends",
  templateUrl: "./friends.page.html",
  styleUrls: ["./friends.page.scss"]
})
export class FriendsPage implements OnInit {
  searchFriend: string = "";
  result = null;
  sub;
  constructor(
    private friendService: FriendsService,
    private afStore: AngularFirestore
  ) {}

  ngOnInit() {}

  async searchChanged() {
    // this.result = await this.friendService.findFriends(this.searchFriend);
    // this.friendService.userDb.valueChanges().subscribe(res => {
    //   console.log("frein res", res, res[0]);
    //   this.result = res;
    // });
    this.sub = await this.afStore
      .collection("UserInfo", ref =>
        ref.where("username", "==", this.searchFriend)
      )
      .valueChanges()
      .subscribe(res => {
        console.log("frein res", res, res[0]);
        this.result = res;
      });

    //console.log(this.result, "res");
  }
}
