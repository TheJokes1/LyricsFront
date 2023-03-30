import { AfterContentChecked, Component, Inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { DataService } from '../services/data.service';


@Component({
  selector: 'my-nav',
  templateUrl: './my-nav.component.html',
  styleUrls: ['./my-nav.component.css']
})
export class NavigationComponent implements AfterContentChecked {
  url: string;
  auth: any;
  title: string;
        
  constructor( @Inject(DOCUMENT) private doc: Document,private data: DataService, private breakpointObserver: BreakpointObserver) {
  }
  
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  logout() {
    this.auth.logout({ returnTo: this.doc.location.origin });
  }

  loginWithPopup() : void {
    this.auth.loginWithRedirect();
  }

  ngAfterContentChecked(): void {
    this.url = window.location.href;
    if (this.url.endsWith("Add")) this.title = 'Add Quote 👍';
    if (this.url.endsWith('Random') || (this.url.endsWith("/"))){
      this.title = '🎵 Quote';
    }
    if (this.url.endsWith('Settings')) this.title = 'Settings 🪛';
    if (this.url.endsWith('Favorites')) this.title = 'My 💖 Artists';
    if (this.url.endsWith('Playlist')) this.title = 'My Playlists';
    if (this.url.endsWith('Songs'))  this.title = 'My songs';
  }
}
