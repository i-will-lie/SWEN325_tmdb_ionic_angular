import { AuthenticationService } from "./../services/authentication.service";
import { Injectable } from "@angular/core";

import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanActivate,
  Router
} from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class TmdbAuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    console.log("bumber is", this.authService.number);
    if (this.authService.tmdbIsAuthenticated()) {
      console.log("can activate tmdb", this.authService.tmdbAuthenticated);
      return true;
    }
    console.log("cant activate tmdb", this.authService.tmdbAuthenticated);
    this.router.navigate(["tmdb-login"]);
    return false;
  }
}
