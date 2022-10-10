import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule, Routes } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { ReviewLyricsDialogComponent } from './reviewLyrics-dialog/review-lyrics-dialog/review-lyrics-dialog.component';
import { NavigationComponent } from './navigation/my-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { SecondPageComponent } from './second-page/second-page.component';
import { ThirdPageComponent } from './third-page/third-page.component';
import { FirstPageComponent } from './first-page/first-page.component';



const appRoutes: Routes = [
  {path: 'first-page', component: FirstPageComponent},
  {path: 'second-page', component: SecondPageComponent},
  {path: 'third-page', component: ThirdPageComponent}
];


@NgModule({
  declarations: [
    AppComponent, ReviewLyricsDialogComponent, NavigationComponent,
    FirstPageComponent, SecondPageComponent, ThirdPageComponent
  ],
  imports: [
    BrowserModule, NoopAnimationsModule, FormsModule, ReactiveFormsModule, HttpClientModule,
    MatAutocompleteModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    BrowserAnimationsModule, MatDialogModule, LayoutModule, MatToolbarModule, MatButtonModule,
    MatSidenavModule, MatIconModule, MatListModule, RouterModule.forRoot(appRoutes),

  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas : [ CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
