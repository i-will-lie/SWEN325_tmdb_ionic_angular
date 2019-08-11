import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { AngularFireAuthGuard } from "@angular/fire/auth-guard";
import { TmdbAuthGuard } from "../guards/tmdb-auth.guard";

const routes: Routes = [
  {
    // path: "members/",
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full"
  },
  {
    path: "dashboard",
    canActivate: [AngularFireAuthGuard, TmdbAuthGuard],
    loadChildren: "./dashboard/dashboard.module#DashboardPageModule"
  },
  {
    canActivate: [AngularFireAuthGuard, TmdbAuthGuard],
    path: "search",
    loadChildren: "./search/search.module#SearchPageModule"
  },
  {
    canActivate: [AngularFireAuthGuard, TmdbAuthGuard],
    path: "detail/:id",
    loadChildren: "./detail/detail.module#DetailPageModule"
  },
  {
    path: "favourites/:accId/:username/:listID",
    loadChildren: "./favourites/favourites.module#FavouritesPageModule"
  },
  {
    path: "profile/:email",
    loadChildren: "./profile/profile.module#ProfilePageModule"
  },
  {
    path: "friends",
    loadChildren: "./friends/friends.module#FriendsPageModule"
  },
  {
    //path: "members/**",
    path: "**",
    redirectTo: "dashboard"
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberRoutingModule {}
