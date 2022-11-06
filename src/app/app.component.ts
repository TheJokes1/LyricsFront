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
  loadingDisabled : boolean = false;
  quote$: Observable<Lyric>;
  wordings?: string;

  constructor(private apiService: ApiService) {
      
  }

  ngOnInit(): void {
    this.quote$ = this.apiService.GetRandomQuote;
    this.quote$.subscribe(res => {
      console.log(res.quote);
      this.loadingDisabled = true;
      this.wordings = res.songTitle;
    })
  }

}



