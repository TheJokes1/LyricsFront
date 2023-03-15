import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FirstPageComponent } from "./first-page/first-page.component";
import { HomepageResolver } from "./resolvers/homepage.resolver";
import { SecondPageComponent } from "./second-page/second-page.component";
import { SettingsComponent } from "./settings/settings.component";
import { ThirdPageComponent } from "./third-page/third-page.component";
import { PlaylistComponent } from "./playlist/playlist.component";


const routes: Routes = [
    {path: '', component: FirstPageComponent},
    {path: 'Random', component: FirstPageComponent},
    {path: 'Add', component: SecondPageComponent},
    {path: 'Favorites', component: ThirdPageComponent},
    {path: 'Settings', component: SettingsComponent},
    {path: 'Playlist', component: PlaylistComponent},
    //{path: '**', redirectTo: ''}
  ]
 

@NgModule({
  imports: [RouterModule.forRoot(routes
    // , {enableTracing: true}
    )],
  exports: [RouterModule]
})

export class AppRoutingModule{

}