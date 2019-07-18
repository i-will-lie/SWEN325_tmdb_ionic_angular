import { AuthGuard } from "./guards/auth.guard";
import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  { path: "", redirectTo: "fb-login", pathMatch: "full" },
  {
    path: "fb-login",
    loadChildren: "./public/fb-login/fb-login.module#FbLoginPageModule"
  },
  {
    path: "fb-register",
    loadChildren: "./public/fb-register/fb-register.module#FbRegisterPageModule"
  },

  {
    path: "tmdb-login",
    loadChildren: "./public/tmdb-login/tmdb-login.module#TmdbLoginPageModule"
  },
  {
    path: "members",
    //canActivate: [AuthGuard],
    loadChildren: "./members/member-routing.module#MemberRoutingModule"
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
