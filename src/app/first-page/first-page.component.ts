import { Component, ElementRef, OnInit, ViewChild, Renderer2, ViewChildren, OnDestroy, PipeTransform, Pipe, AfterViewInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { debounceTime, Observable } from 'rxjs';
import { ApiService } from '../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { Lyric } from '../lyric';
import { FilterService } from '../services/filter.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AudioPlayerComponent } from '../audio-player/audio-player.component';


//import { AllSpotLinks } from '../allSpotLinks';

@Pipe({ name: "safeHtml" })
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string) {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}

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

export class FirstPageComponent implements OnDestroy, PipeTransform {
  @ViewChild('audioPlayer', { static: false }) audioPlayer: AudioPlayerComponent;
  disablePerfomer: boolean = false;
  disableButton: boolean = true;
  makeFilter = new FormControl('');
  performerName? : string;
  iD: number = 0;
  lyrics: any;
  lyrics1: string;
  songtitle : string = "";
  title : any;
  LyricIdsCopy: number[] = new Array();
  loadedLyric: Lyric = {} as Lyric;
  lyricList$: Observable<Lyric[]>;
  lyricList: number[] = new Array();

  statusClass1: string; // = "transparent";
  statusClass2: string = "400"
  statusClass3: string = "0 0 13px #000;"
  statusClass10: string; // = "transparent";
  statusClass20: string = "400"
  statusClass30: string = "0 0 13px #000;" 
  random_color: string;
  quote$: Observable<Lyric>;
  token: string;
  formattedLyrics: any;
  formattedLyrics2: any;
  formattedLyrics3: any;
  formatted: boolean;
  p1: any;
  p2: any;
  p3: any;
  formattedLyrics4: any;
  randomNumber: number;
  lyricId: any;
  filteredLanguage: string = "";
  filteredEra: string = "";
  filteredText: string = "";
  numberOfLoadedLyrics: number = 0;
  showImage: boolean = false;
  test: any = "";
  titlesColor: string;
  
  constructor(public apiService: ApiService, public dialog: MatDialog,
    public el: ElementRef, private renderer: Renderer2, private filterService: FilterService) {  

     this.apiService.GetAccessToken().subscribe({ //get the spotify access token through the backend.
      next: (response: any) => {
        console.log("response Spotify: ", response);
        this.token= response.access_token;
        this.getLyrics("", "", ""); 
        //this.getSpotifyUrls();
      },
      error: error => console.log(error),
      complete : () => {}
    })

    if (localStorage.getItem('showArtist') === 'true') {
      this.unblurArtist();
    } 

    if (localStorage.getItem('showTitle') === 'true') { 
      this.unblurTitle();
    }
    // EMPLOYED FILTERS
    this.filterService.languageFilter.subscribe((language) => {
      this.filteredLanguage = language;
      this.showImage = false;
      this.getLyrics(this.filteredLanguage, this.filteredEra, this.filteredText); // LOADING LYRICS LIST BASED ON THE FILTER
    })

    this.filterService.eraFilter.subscribe((value) => {
      this.filteredEra = value;
      this.getLyrics(this.filteredLanguage, this.filteredEra, this.filteredText); // LOADING LYRICS LIST BASED ON THE FILTER
      this.showImage = false;
    })

    this.filterService.textFilter.pipe(debounceTime(1000)).subscribe((value) => {
      this.filteredText = value; 
      this.showImage = false;
      this.getLyrics(this.filteredLanguage, this.filteredEra, this.filteredText) // LOADING LYRICS LIST BASED ON THE FILTER
    });

    this.renderer.listen('document', 'click', (event) => {
      if (event.target.id == "perf") {
        this.unblurArtist();
        this.showImage = !this.showImage;
      }
      else if (event.target.id == "titled"){
        this.unblurTitle();
        this.showLyricsUnblurred();
      }
      else if (event.target.localName == "div"){
        this.unblurArtist();
        this.unblurTitle();
        this.showLyricsUnblurred();
      }
      else if (event.target.id == "preview"){
      }
    });
  } 

  // END OF CONSTRUCTOR

  transform(value: any, ...args: any[]) {
    throw new Error('Method not implemented.');
  }

  blurArtist(){
    this.statusClass1 = "transparent";
    this.statusClass2 = "400";
    this.statusClass3 = "0 0 13px #000";
  }

  blurTitle(){
    this.statusClass10 = "transparent";
    this.statusClass20 = "400";
    this.statusClass30 = "0 0 13px #000";
  }

  unblurArtist(){
    this.statusClass1 = this.titlesColor;
    this.statusClass2 = "850";
    this.statusClass3 = "none";
  }

  unblurTitle(){
    this.statusClass10 = this.titlesColor;
    this.statusClass20 = "850";
    this.statusClass30 = "none";
  }
  

  getLyrics(language: string, era: string, text: string) { //based on the language/era filters it gets the list of lyrics
    this.lyricList$ = this.apiService.GetLyrics(language, era, text);
    this.lyricList$.subscribe({
      next: (response: any) => {
        if (response.length > 0) { //change observable to array
          this.lyricList = response.map((lyric: Lyric) => lyric.lyricId);
          this.LyricIdsCopy = [...this.lyricList]; // to reset the LyricList array
          this.loadLyrics();
        }
        else {
          this.loadedLyric.performer = "No titles found for this filter.";
          this.loadedLyric.songTitle = "Try something else.";
          this.unblurArtist();
          this.unblurTitle();
          this.formatLyrics("", "");
          this.showImage = false;
        }
      },
      error: error => console.log(error),
      complete: () => {}
    });   
  }

  loadLyrics() {
    // SET ALL COLORS
    var colors = ["rgb(200, 162, 200)", "rgb(188, 127, 130)", "rgb(155, 191, 150)", "rgb(225, 158, 132)", "rgb(144, 166, 202)", "rgb(218, 191, 122)", "rgb(190, 190, 188)"]
    var titlesColors = [
      "rgb(170, 98, 115)",   // Dusty Pink
      "rgb(146, 111, 85)",   // Khaki
      "rgb(111, 142, 121)",  // Sage Green
      "rgb(172, 118, 105)",  // Peachy Tan
      "rgb(89, 112, 145)",   // Steel Blue
      "rgb(123, 104, 130)",  // Amethyst
      "rgb(122, 122, 162)"   // Slate Gray
    ]    
    
    this.random_color = colors[Math.floor(Math.random() * colors.length)];
    this.titlesColor = titlesColors[Math.floor(Math.random() * titlesColors.length)];

    if (localStorage.getItem('showArtist') === 'false') // blur/unblur the right elements
      {this.blurArtist();}
    else {this.statusClass1 = this.titlesColor;}

    if (localStorage.getItem('showTitle') === 'false') 
      {this.blurTitle();}
      else {this.statusClass10 = this.titlesColor;}
    
    this.randomNumber = Math.floor(Math.random() * this.lyricList.length); //e.g. 36
    //console.log(this.lyricList);
    this.lyricId = this.lyricList[this.randomNumber]; //e.g. 36e ID in the list = eg. id 45
    this.lyricList.splice(this.randomNumber, 1); //remove the used ID from the list
    if (this.lyricList.length == 0) {
      this.lyricList= [...this.LyricIdsCopy]; // reset the LyricList array to original state
    } 

    //choose an ID for TESTING if needed:
    //---------------------------------
    //this.lyricId= 256;
    this.quote$ = this.apiService.GetLyric(this.lyricId); // GET LYRIC
    this.quote$.subscribe({
      next: (response: any) => {
        //console.log(response); SHOW RESPONSE HERE IN CONSOLE
        this.loadedLyric.quote = this.formatLyrics(response.quote, response.songTitle!);
        this.loadedLyric.lyricId = response.lyricId;
        this.loadedLyric.songTitle = response.songTitle;
        this.loadedLyric.performer = response.performer;
        this.loadedLyric.spotLink = response.spotLink;
        this.loadedLyric.imageUrl = response.imageUrl;
        this.loadedLyric.previewLink = response.previewLink;
        this.loadedLyric.popularity = response.popularity;
        if (response.spotLink?.substring(0,5) != 'https' || response.imageUrl?.substring(0,5) != 'https'
          || response.previewLink?.substring(0,5) != 'https' || response.releaseDate == null)
        { 
          this.getSpotifyUrls();
        }
        else console.log("no need to get spotify urls");
      },
      error: error => console.log("error: ", error),
      complete: () => {}
    });
  }
  // END OF LOADLYRICS

  loadLyricsIf(){
    //loadLyrics only when title is unblurred
    if (this.statusClass10 != "transparent"){
      this.loadLyrics();
    }
  }

  formatLyrics (quote: string | undefined, title: string){ //format for displaying correctly
    this.formatted = false;
    while (!this.formatted){ // remove points and spaces from the end of the string
      if (quote?.charAt(quote.length) == "." || quote?.charAt(quote.length) == " ") {
        this.formattedLyrics = quote.substring(0,quote.length-1);
      } else {
        this.formattedLyrics = quote;
        this.formatted = true;
      }
    }

    // add line breaks
    this.formattedLyrics2= this.formattedLyrics.trim();
    this.formattedLyrics3 = this.formattedLyrics2.replaceAll('?', '?\n')
    this.formattedLyrics4 = this.formattedLyrics3.replaceAll('\n\n', '\n');
    this.lyrics = this.formattedLyrics4.replaceAll('.', '\n');

    // try replacing all titles in the quote with a blur
    this.p1= this.lyrics;
    if (localStorage.getItem('showTitle') === 'false') {
      const reg = new RegExp(title, "gi");
      this.p1 = this.p1.replace(reg,`<b>${title}</b>`);
      this.p1= `<style> b {color: black; font-weight:400; filter: blur(6px);} </style>` + this.p1;
    }
    return this.lyrics;
  }

  showLyricsUnblurred(){ //remove all styling from p1
    this.p1 = this.lyrics;
  }
  

  getSpotifyUrls(){
    this.apiService.getSpotifyInfo(this.token, this.loadedLyric.performer, this.loadedLyric.songTitle).subscribe({
      next: (response:any) => {
        console.log("spotify says: ", response);
        this.loadedLyric.spotLink= response.tracks.items[0].external_urls.spotify;
        this.loadedLyric.previewLink = response.tracks.items[0].preview_url;
        
        this.loadedLyric.releaseDate = response.tracks.items[0].album.release_date;
        this.loadedLyric.imageUrl = response.tracks.items[0].album.images[1].url;
        this.loadedLyric.popularity = this.getPopularityAndDate(response);
        //links Object for the HTTP  PUT
        this.apiService.AddSpotifyLinks(this.loadedLyric.lyricId!, this.loadedLyric.spotLink!, this.loadedLyric.imageUrl!, 
            this.loadedLyric.previewLink, this.loadedLyric.popularity, this.loadedLyric.releaseDate!).subscribe(data => {
          console.log("spotify links added to db: ", data)});
      },
      error: error => {
        this.loadedLyric.spotLink="";
        console.log(error);
      },
      complete: () => {
        
      }
    })
  }

  getPopularityAndDate (response: any) : number { //get popularity and release date from spotify API
    var highest = 2;
    var earliestDate = +response.tracks.items[0].album.release_date.substring(0,4);
    var limit = response.tracks.items.length;
    for (var i: any = 0; i<limit; i++){
      if (response.tracks.items[i].popularity > highest) {
        highest = response.tracks.items[i].popularity;
      } 
      if (+response.tracks.items[i].album.release_date.substring(0,4) < earliestDate
        && response.tracks.items[i].name.toLowerCase().includes(this.loadedLyric.songTitle?.toLowerCase())
        && response.tracks.items[i].artists[0].name.toLowerCase().includes(this.performerName?.toLowerCase())) {
      earliestDate = +response.tracks.items[i].album.release_date.substring(0,4);
    }
      //if (highest>75) i=i+20;
    } 
    console.log("earliest date: ", earliestDate);
    this.loadedLyric.releaseDate = earliestDate.toString();
    return highest;
  };

  toggleP(){ //show or hide album image
    this.showImage = !this.showImage;
  }

  ngOnDestroy(){
    // this.subscription.unsubscribe();
    // this.subscription2.unsubscribe();
    // this.subscription3.unsubscribe();
  }

}
