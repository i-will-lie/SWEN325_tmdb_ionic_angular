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
    path: "detail/:id/:type",
    loadChildren: "./detail/detail.module#DetailPageModule"
  },
  {
    path: "favourites/:accId/:username/:listID",
    loadChildren: "./favourites/favourites.module#FavouritesPageModule"
  },
  {
    path: "profile/:email/:username",
    loadChildren: "./profile/profile.module#ProfilePageModule"
  },
  {
    path: "friends",
    loadChildren: "./friends/friends.module#FriendsPageModule"
  },
  {
    path: "image/:poster_path",
    loadChildren: "./image/image.module#ImagePageModule"
  },
  {
    //path: "members/**",
    path: "**",
    redirectTo: "dashboard"
  },
  { path: "image", loadChildren: "./image/image.module#ImagePageModule" }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberRoutingModule {}
