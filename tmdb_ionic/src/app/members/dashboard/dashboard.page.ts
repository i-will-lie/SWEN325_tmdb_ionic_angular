import { FavouritesService } from "./../../services/favourites.service";
import { SessionService } from "./../../services/session.service";
import { UserDatabaseService } from "./../../services/user-database.service";
import { AuthenticationService } from "./../../services/authentication.service";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ActionSheetController, NavController } from "@ionic/angular";
import { SearchService } from "../../search.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.page.html",
  styleUrls: ["./dashboard.page.scss"]
})
/**
 * The main landing page of the app accting as the hub. Displays popular title.
 */
export class DashboardPage implements OnInit {
  randomItem; //the randomly pick title to display
  popular; //list of popular titles from tmdb

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private userDbServ: UserDatabaseService,
    private sessionServ: SessionService,
    private favouriteServ: FavouritesService,
    public asCtrl: ActionSheetController,
    private searchServ: SearchService
  ) {}

  /**
   * On initialisation find and set the favourite service to track the user.
   * Get the list of popular titles from tmdb and randomly display one.
   */
  async ngOnInit() {
    this.favouriteServ.setCurrentUser(this.sessionServ.email);
    this.searchServ.getPopular().then(res => {
      this.popular = res["results"];
      this.getRandomMovie();
    });
  }

  /**
   * Get a random title from the popular list.
   */
  getRandomMovie() {
    //generate a index number to choose from the popular list
    const index = this.searchServ.generateNumber(this.popular.length);
    const item = this.popular[index]["id"]; //ID of the title

    //retrieve item to present it
    this.searchServ
      .getDetails("movie", item)
      .toPromise()
      .then(res => {
        this.randomItem = res;
      });
  }
  /**
   * Navigate to the given page of members.
   * Doesn't include profile or favourites.
   *
   * @param newPage:string
   */
  async navigate(newPage) {
    this.router.navigate(["members", newPage]);

    //this.router.navigate(["members", "profile"]);
    //this.router.navigate(["members", "search"]);
  }

  navigateToProfile(newPage: string, profile: string, username: string) {
    this.router.navigate(["members", newPage, profile, username]);
  }

  /**
   * Navigate to the favourites page of the app user
   * using their details as path.
   */
  navigateToFavourites() {
    this.router.navigate([
      "members",
      "favourites",
      this.favouriteServ.tmdbAccId,
      this.favouriteServ.tmdbUser,
      this.favouriteServ.tmdbFavId
    ]);
  }
  navigateToDetail() {
    this.router.navigate(["members", "detail", this.randomItem["id"], "movie"]);
  }
  logout() {
    console.log("OUT");
    this.authService.logout();
    // this.userDbServ.dbLogout(this.sessionServ.email);
    // this.router.navigate([""]);
  }

  getCurrentUserEmail() {
    return this.sessionServ.email;
  }
  getCurrentAccId() {
    return this.sessionServ.accountID;
  }
  getCurrentUsername() {
    return this.sessionServ.username;
  }

  getCurrentListID() {
    return this.userDbServ.favouriteListID;
  }

  // goBack() {
  //   this.navCtrl.pop();
  // }
}
