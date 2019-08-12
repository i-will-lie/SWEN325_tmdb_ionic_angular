import { FavouritesService } from "./../../services/favourites.service";
import { SessionService } from "./../../services/session.service";
import { UserDatabaseService } from "./../../services/user-database.service";
import { AuthenticationService } from "./../../services/authentication.service";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ActionSheetController } from "@ionic/angular";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.page.html",
  styleUrls: ["./dashboard.page.scss"]
})
export class DashboardPage implements OnInit {
  favouriteListID;
  actionSheet;
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private userDbServ: UserDatabaseService,
    private sessionServ: SessionService,
    private favouriteServ: FavouritesService,
    public asCtrl: ActionSheetController
  ) {}

  async ngOnInit() {
    console.log("DASHING", this.sessionServ.email);
    this.favouriteServ.setCurrentUser(this.sessionServ.email);
    // await this.userDbServ.dbUser.toPromise().then(res => {
    //   console.log("FAV", res["favourites"], this.sessionServ.email);
    //   this.favouriteListID = res["favourites"];

    // });
  }

  async navigate(newPage) {
    this.router.navigate(["members", newPage]);

    //this.router.navigate(["members", "profile"]);
    //this.router.navigate(["members", "search"]);
  }

  navigateToProfile(newPage, profile) {
    this.router.navigate(["members", newPage, profile]);
  }
  navigateToFavourite(newPage, accountId, username, listId) {
    console.log(
      "BLAH",
      newPage,
      this.favouriteServ.tmdbAccId,
      this.favouriteServ.tmdbUser,
      this.favouriteServ.tmdbFavId
    );
    this.router.navigate([
      "members",
      newPage,
      this.favouriteServ.tmdbAccId,
      this.favouriteServ.tmdbUser,
      this.favouriteServ.tmdbFavId
    ]);
  }

  logout() {
    console.log("OUT");
    this.authService.fbLogut();
    this.userDbServ.dbLogout(this.sessionServ.email);
    this.router.navigate([""]);
  }

  getCurrentUserEmail() {
    return this.sessionServ.email;
  }
  getCurrentAccId() {
    console.log("accIDDDDDDDDDDDDDDDDDDDDDDDD", this.sessionServ.accountID);
    return this.sessionServ.accountID;
  }
  getCurrentUsername() {
    return this.sessionServ.username;
  }

  getCurrentListID() {
    return this.userDbServ.favouriteListID;
  }
}
