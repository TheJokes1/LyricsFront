import { AfterContentChecked, AfterViewChecked, AfterViewInit, Component, Inject, Input } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'my-nav',
  templateUrl: './my-nav.component.html',
  styleUrls: ['./my-nav.component.css']
})
export class NavigationComponent implements AfterContentChecked{
  url: string;
  title: string;
  constructor(public auth: AuthService, @Inject(DOCUMENT) private doc: Document,private breakpointObserver: BreakpointObserver) {}

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

    logout() {
      this.auth.logout({ returnTo: this.doc.location.origin });
    }

    loginWithPopup() : void {
      //this.auth.loginWithRedirect();
    }

    ngAfterContentChecked(): void {
      this.url = window.location.href;
      if (this.url.endsWith("Add")) this.title = 'Add Quote 👍';
      if (this.url.endsWith('Random') || (this.url.endsWith("/"))) this.title = 'Random Quote 🎵';
    }
}
