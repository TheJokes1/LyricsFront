import { Component, OnInit } from '@angular/core';
import { filter, Observable } from 'rxjs';
import { ApiService } from './services/api.service';
import { SplashScreenStateService } from './services/splash-screen-state.service';
import { Lyric } from './Shared/Lyric';
import { ActivatedRouteSnapshot, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterEvent, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent implements OnInit {
  quote$: Observable<Lyric>;
  wordings?: string;
  public stopped: boolean;
  load: boolean;

  constructor(private apiService: ApiService, private splashScreenStateService: SplashScreenStateService, private router: Router) {  
    this.router.events
    .pipe(filter(event => event instanceof NavigationStart || event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError))    
    .subscribe(
      event => {
        console.group ("Router event: ", event.constructor.name);
        this.checkRouterEvent(event)
      });

      if (!localStorage.getItem('showArtist')){
        //this.router.navigateByUrl('/settings');
        localStorage.setItem('showArtist', JSON.stringify(true));
      }

      if (!localStorage.getItem('showTitle')){
        localStorage.setItem('showTitle', JSON.stringify(false));
      }
  }

  ngOnInit(): void {
    console.log("FIRST CALL");
    this.quote$ = this.apiService.GetLyric(1);;
    this.quote$.subscribe(res => {
      console.log("quote:", res);
      // this.wordings = res.songTitle;
      //this.splashScreenStateService.stop();
      //this.route.navigateByUrl('/');
      this.stopped = true;
    })
  }

  checkRouterEvent (event : any){
    if (event instanceof NavigationStart) {
      this.load = true;
    }

    if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError){
      this.load = false;
    }
  }
}
