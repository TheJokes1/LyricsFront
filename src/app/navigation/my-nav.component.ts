import { AfterContentChecked, Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'my-nav',
  templateUrl: './my-nav.component.html',
  styleUrls: ['./my-nav.component.css']
})
export class NavigationComponent implements AfterContentChecked {
  url: string;
  title: string;
  logoutError = '';
        
  constructor(public authService: AuthService, private breakpointObserver: BreakpointObserver) {
  }
  
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  async logout(): Promise<void> {
    this.logoutError = '';
    try {
      await this.authService.signOut();
    } catch (error) {
      this.logoutError = error instanceof Error ? error.message : 'Unable to log out. Please try again.';
    }
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
