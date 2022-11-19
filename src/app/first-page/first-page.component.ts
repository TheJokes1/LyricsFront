import { Component, ElementRef, OnInit, ViewChild, Renderer2, ViewChildren } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { debounceTime, Observable, startWith, switchMap } from 'rxjs';
import { ApiService } from '../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { Lyric } from '../lyric';

export interface DialogLyricData {
  dLyrics: string;
  dSongTitle: string;
}

export interface Performer {
  performerId: number;
  name: string;
  lyrics?: Lyric[];
  favouritePerformers?: FavouritePerformer[];
}

export interface Player {
  playerId: number;
  name: string;
  starredLyrics: StarredLyric[];
  favouritePerformers: FavouritePerformer[];
}

export interface StarredLyric {
  id: number;
  playerId: number;
  lyricId: number;
  player: Player;
  lyric: Lyric;
}

export interface FavouritePerformer {
  id: number;
  playerId: number;
  performerId: number;
  player: Player;
  performer: Performer;
}

@Component({
  selector: 'app-first-page',
  templateUrl: './first-page.component.html',
  styleUrls: ['./first-page.component.css']
})
export class FirstPageComponent implements OnInit{

  disablePerfomer: boolean = false;
  disableButton: boolean = true;
  makeFilter = new FormControl('');
  performerName? : string;
  iD: number = 0;
  lyrics: any;
  lyrics1: string;
  songtitle : string = "";
  title : any;
  usedLyricIds: number[] = new Array();
  haveToReload: boolean= false;
  loadedLyric: Lyric = {};

  statusClass1: string = "transparent";
  statusClass2: string = "400"
  statusClass3: string = "0 0 13px #000;"
  statusClass10: string = "transparent";
  statusClass11: string = "transparent";
  statusClass20: string = "400"
  statusClass30: string = "0 0 13px #000;" 
  random_color: string;
  quote$: Observable<Lyric>;
  token: string;
  link: any;
  formattedLyrics: any;
  formattedLyrics2: any;
  formattedLyrics3: any;
  formatted: boolean;
  p1: any;
  p2: any;
  p3: any;
  formattedLyrics4: any;
  
  constructor(public apiService: ApiService, public dialog: MatDialog,
  public el: ElementRef, public renderer: Renderer2) {  

    this.apiService.GetSpotifyCreds().subscribe({
    next: (response: any) => {
      this.token= response.access_token;
      this.loadLyrics();
    },
    error: error => console.log(error),
    complete : () => {}
    })

    this.renderer.listen('document', 'click', (event) => {
      if (event.target.id == "perf") {
          this.statusClass1 = "rgb(39, 7, 181)"
          this.statusClass2 = "850";
          this.statusClass3 = "none";
        }
      else if (event.target.id == "titled"){
          this.statusClass10 = "rgb(39, 7, 181)"
          this.statusClass20 = "850";
          this.statusClass30 = "none";
          this.statusClass11 = "rgb(39, 7, 81)";
      }
      else if (event.target.localName == "div"){
        this.statusClass1 = "rgb(39, 7, 181)"
        this.statusClass2 = "850";
        this.statusClass3 = "none";
        this.statusClass10 = "rgb(39, 7, 181)"
        this.statusClass11 = "rgb(39, 7, 81)";
        this.statusClass20 = "850";
        this.statusClass30 = "none";
      }
    });
  }

  ngOnInit() {
  }

  onSelection(perf: Performer){
    this.performerName = perf.name;
    this.makeFilter.disable;
    this.disableButton = false;
    console.log(perf.name, perf.performerId);
    this.iD = perf.performerId;
  }

  changePerformer(){
    this.disableButton = true;
  }

  checkLyricIdOnRepeat(id: number): boolean {
    this.haveToReload = false;
    // HARD CODED NONSENSE THIS 88!!!! 
    if (this.usedLyricIds.length == 80) this.usedLyricIds.splice(0, this.usedLyricIds.length);
    this.usedLyricIds.find(element => {
      if (element == id) {
        this.haveToReload = true;
        return true;
      } 
      else {
        this.haveToReload = false
        return false;
      }
    });
    return this.haveToReload;
  }

  loadLyrics() {
    this.statusClass1 = "transparent";
    this.statusClass2 = "400";
    this.statusClass3 = "0 0 13px #000";
    this.statusClass10 = "transparent";
    this.statusClass11 = "transparent";
    this.statusClass20 = "400";
    this.statusClass30 = "0 0 13px #000";
    this.quote$ = this.apiService.GetRandomQuote;
    this.quote$.subscribe(response => { 
      if (this.checkLyricIdOnRepeat(response.lyricId!) == true){ 
        this.loadLyrics(); // if it's a double, load another one.
      }else { // if no double: format and display it:
        console.log(response.lyricId);
        this.loadedLyric.quote = this.formatLyrics(response.quote, response.songTitle!);
        this.loadedLyric.songTitle = response.songTitle;
        this.loadedLyric.performer = response.performer;
        if (response.spotLink?.substring(0,5) != 'https'){ // if there's no spotify link in DB: get it from Spotify
          console.log("not HTTPS");
          this.getSpotifyUrl();

        } 
        this.loadedLyric.spotLink = response.spotLink;
        this.loadedLyric.lyricId = response.lyricId;
        this.usedLyricIds.push(response.lyricId!); // add lyricId to array (to check on doubles)
        var colors = ['#E497DA', '#DFF67F', '#B2F8F4', '#B2E2F8', '#CEB2F8',
          '#FBDEFF', '#FFDEED','#F5A8A0', '#F5E2A0','#F9A02C'];
        this.random_color = colors[Math.floor(Math.random() * colors.length)];
      }
    })
   }

  formatLyrics (quote: string | undefined, title: string){
    this.formatted = false;
    while (!this.formatted){ // remove points and spaces from the end of the string
      if (quote?.charAt(quote.length) == "." || quote?.charAt(quote.length) == " ") {
        this.formattedLyrics = quote.substring(0,quote.length-1);
      } else {
        this.formattedLyrics = quote;
        this.formatted = true;
      }
    }    

    this.formattedLyrics2= this.formattedLyrics.trim();
    this.formattedLyrics3 = this.formattedLyrics2.replaceAll('?', '?\n')
    this.formattedLyrics4 = this.formattedLyrics3.replaceAll('\n\n', '\n');
    this.lyrics = this.formattedLyrics4.replaceAll('.', '\n');

    const titleL= title.toLowerCase();
    const quoteL= this.lyrics.toLowerCase(); 
    const position = quoteL.indexOf(titleL);
    quote= this.lyrics;

    if (position > -1) { //if the songTitle appears in the quote -> chop up the string and blur it
      this.p1= quote?.substring(0, position);
      this.p2= quote?.substring(position, position + title.length);      
      this.p3= quote?.substring(position+title.length, quote.length);
    } else {
      this.p1 = this.lyrics;
      this.p2="";
      this.p3=""
    }
    console.log(this.p1 + this.p2 + this.p3);
    return this.lyrics;
  }

  getSpotifyUrl(){
    this.apiService.getSpotifyInfo(this.token, this.loadedLyric.performer, this.loadedLyric.songTitle).subscribe({
      next: (response:any) => {
        console.log(response);
        this.link= response.tracks.items[0].external_urls.spotify;
      },
      error: error => {
        this.link="";
        console.log(error);
      },
      complete: () => {
        this.apiService.AddSpotLink(this.loadedLyric.lyricId!, this.link).subscribe(data => {
        });
      }
    })
  }

}
