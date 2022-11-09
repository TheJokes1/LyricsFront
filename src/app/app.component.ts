import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './services/api.service';
import { SplashScreenStateService } from './services/splash-screen-state.service';
import { Lyric } from './lyric';
import { ActivatedRouteSnapshot, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent implements OnInit {
  quote$: Observable<Lyric>;
  wordings?: string;
  public stopped: boolean;

  constructor(private apiService: ApiService, private splashScreenStateService: SplashScreenStateService, private route: Router) {  
  }

  ngOnInit(): void {
    this.quote$ = this.apiService.GetRandomQuote;
    this.quote$.subscribe(res => {
      console.log("quote:", res.quote);
      // this.wordings = res.songTitle;
      //this.splashScreenStateService.stop();
      //this.route.navigateByUrl('/');
      this.stopped = true;
    })
  }
}
