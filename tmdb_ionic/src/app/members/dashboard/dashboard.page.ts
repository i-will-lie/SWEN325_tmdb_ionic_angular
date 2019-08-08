import { AuthenticationService } from "./../../services/authentication.service";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.page.html",
  styleUrls: ["./dashboard.page.scss"]
})
export class DashboardPage implements OnInit {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {}

  navigate(newPage, profile: string = "") {
    console.log("going to", newPage);
    //this.router.navigate(["favourites"]);
    if (profile == "") {
      this.router.navigate(["members", newPage]);
    } else {
      this.router.navigate(["members", newPage, profile]);
    }

    //this.router.navigate(["members", "profile"]);
    //this.router.navigate(["members", "search"]);
  }

  logout() {
    this.authService.fbLogut();
    this.router.navigate([""]);
  }

  getCurrentUserEmail() {
    return this.authService.getEmail();
  }
}
