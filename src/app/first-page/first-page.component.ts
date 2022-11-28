import { Component, ElementRef, OnInit, ViewChild, Renderer2, ViewChildren } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { debounceTime, Observable, startWith, switchMap } from 'rxjs';
import { ApiService } from '../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { Lyric } from '../lyric';
import { FilterService } from '../services/filter.service';

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
export class FirstPageComponent{

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
  loadedLyric: Lyric = {};
  // lyricList$: Observable<Lyric[]>;
  lyricList$: Observable<Lyric[]>;
  lyricList: number[];

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
  popularity: number;
  previewLink: any;
  artistImage: any;
  lengthLyrics: number = 0;
  randomNumber: number;
  hideQuote: boolean = false;
  lyricId: any;
  filteredLanguage: any = "";

  
  constructor(public apiService: ApiService, public dialog: MatDialog,
    public el: ElementRef, public renderer: Renderer2, private filter: FilterService) {  

      this.apiService.GetSpotifyCreds().subscribe({
      next: (response: any) => {
        this.token= response.access_token;
      },
      error: error => console.log(error),
      complete : () => {}
    })

    this.filter.updateFilter$.subscribe((language) => {
      this.filteredLanguage = language;
    });
  
    //LOADING LYRICS FOR THE FIRST TIME HERE
    this.getLyrics(this.filteredLanguage);

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
  } // END OF CONSTRUCTOR

  getLyrics(language: string) {
    this.lyricList$ = this.apiService.GetLyrics(language);
    this.lyricList$.subscribe({
      next: (response: any) => {
        this.lengthLyrics = response.length;
        this.lyricList = response.map((lyric: Lyric) => lyric.lyricId);
        this.loadLyrics(); // LOADLYRICS
      },
      error: error => console.log("error: ", error),
      complete: () => {}
    });   
  }

  iDAlreadyUsed(id: number): boolean {
    if (this.usedLyricIds.includes(id)) {
      //console.log("Houston, we needed a reload on ", id);
      return true;
    }else 
      this.usedLyricIds.push(id);
      return false;
  }

  loadLyrics() {
    this.statusClass1 = "transparent";
    this.statusClass2 = "400";
    this.statusClass3 = "0 0 13px #000";
    this.statusClass10 = "transparent";
    this.statusClass11 = "transparent";
    this.statusClass20 = "400";
    this.statusClass30 = "0 0 13px #000";

    //check in LOOP if the id is already used. Get outta loop when OKAY
    do{
      this.randomNumber = Math.floor(Math.random() * this.lengthLyrics); //36 
      this.lyricId = this.lyricList[this.randomNumber]; //36e ID in de rij= bv. 45
    }
    while (this.iDAlreadyUsed(this.lyricId));
    //console.log(this.usedLyricIds.sort(function(a, b){return a - b}));

    // if no double: get it, format and display it:    
    this.quote$ = this.apiService.GetLyric(this.lyricId);
    this.quote$.subscribe({
      next: (response: any) => {
        this.loadedLyric.quote = this.formatLyrics(response.quote, response.songTitle!);
        this.loadedLyric.songTitle = response.songTitle;
        this.loadedLyric.performer = response.performer;
        this.loadedLyric.lyricId = response.lyricId;
        if (response.spotLink?.substring(0,5) == 'https'){ // if there's no spotify link in DB: get it from Spotify
          this.loadedLyric.spotLink = response.spotLink;
          this.link = response.spotLink;
        }else{     
          this.getSpotifyUrl();
        }
      },
      error: error => console.log("error: ", error),
      complete: () => {}
    });

    var colors = ['#E497DA', '#DFF67F', '#B2F8F4', '#B2E2F8', '#CEB2F8',
      '#FBDEFF', '#FFDEED','#F5A8A0', '#F5E2A0','#F9A02C'];
    this.random_color = colors[Math.floor(Math.random() * colors.length)];
  }
  // END OF LOADLYRICS


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

    if (position > -1) { // if the songTitle appears in the quote -> chop up the string and blur it
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
        this.popularity = this.getPopularity(response);
        this.previewLink = response.tracks.items[0].preview_url;
        this.artistImage = response.tracks.items[0].album.images[1].url;
        console.log(this.artistImage);
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

  getPopularity (response: any) : number {
    var highest = 2;
    var limit = response.tracks.items.length;
    for (var i: any = 0; i<limit; i++){
      if (response.tracks.items[i].popularity > highest) {
        highest = response.tracks.items[i].popularity;
        
      } 
      if (highest>57) i=i+10;
    } 
    console.log("popularity: ", highest);
    return highest;
  };

  onSwipeLeft(){
    console.log("swipe left");
    this.hideQuote = true;
  }

  onswipeRight(){
    console.log("swipe right");
    this.hideQuote = false;
  }

}
