import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FirstPageComponent } from "./first-page/first-page.component";
import { HomepageResolver } from "./resolvers/homepage.resolver";
import { SecondPageComponent } from "./second-page/second-page.component";
import { ThirdPageComponent } from "./third-page/third-page.component";

const routes: Routes = [
    {path: '', component: FirstPageComponent},
    {path: 'Random', component: FirstPageComponent},
    {path: 'Add', component: SecondPageComponent},
    {path: 'Favorites', component: ThirdPageComponent},
    {path: '**', redirectTo: ''}
  ]
 

@NgModule({
  imports: [RouterModule.forRoot(routes
    // , {enableTracing: true}
    )],
  exports: [RouterModule]
})

export class AppRoutingModule{

}