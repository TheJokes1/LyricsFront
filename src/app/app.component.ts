import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Lyric } from './lyric';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent implements OnInit {
  //loadingDisabled : boolean = false;
  quote$: Observable<Lyric>;
  wordings?: string;
  loadingDisabled : boolean = false;

  constructor(private apiService: ApiService) {
    if (localStorage.getItem("loadingDisabled")== "true") this.loadingDisabled = true;
      
  }

  ngOnInit(): void {
    this.quote$ = this.apiService.GetRandomQuote;
    this.quote$.subscribe(res => {
      console.log(res.quote);
      localStorage.setItem("loadingDisabled", "true");
      this.loadingDisabled = true;
      this.wordings = res.songTitle;
    })
  }
}



