import { HttpClient } from '@angular/common/http';
import { Component, Input, NgZone, OnInit, Pipe, PipeTransform, Renderer2 } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from '../services/data.service';
import { ApiService } from '../services/api.service';
import { Lyric } from '../Shared/Lyric';
import { Playlist } from '../Shared/Playlist';
import { Track } from '../Shared/Track'

@Pipe({ name: "safeHtml" })
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string) {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}

@Component({
  selector: 'app-playlist-song',
  templateUrl: './playlist-song.component.html',
  styleUrls: ['./playlist-song.component.scss']
})
export class PlaylistSongComponent {
  random_color: string;
  titlesColor: string;
  statusClass1: any;
  statusClass10: any;
  randomNumber: number;
  lyricId: any;
  LyricIdsCopy: any;
  lyricListIds: number[] = new Array();
  quote: string = "";
  showImage: any= false;
  loadedLyric: Lyric = {} as Lyric;  
  formatted: boolean;
  lyrics: any;
  p1: any;
  statusClass2: string;
  statusClass3: string;
  statusClass20: string;
  statusClass30: string;
  //chosenPlaylist: Playlist = {} as Playlist;
  chosenPlaylist: string;
  playlistUrl: any;
  aToken: any;
  tracks: Array<{artist: string, title: string}> = [];
  router: any;
  baseUrl: string = 'https://api.musixmatch.com/ws/1.1/';
  dictionary = new Map<string, string>();
  artist: string;
  artistToSearch: string;
  title: string;
  titleToSearch: string;
  allTracks: Array<{artist: '', title: ''}> = [];
  allTracksCopy: Array<{artist: '', title: ''}> = [];
  activeChunk: number = 0;
  titlePlaylist: string;

  constructor(private renderer: Renderer2, private dataService: DataService, private apiService: ApiService,
    private zone: NgZone) {
    this.allTracks = this.dataService.tracksPlaylist; //Array
    this.titlePlaylist = this.dataService.chosenPlaylist.name; //Object.name
    console.log(this.titlePlaylist);
    this.allTracksCopy = [...this.allTracks];
    console.log("all tracks: ", this.allTracks);
    this.getLyrics();
    this.loadedLyric.spotLink = "";
    this.loadedLyric.imageUrl = "";
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

  showLyricsUnblurred(){ //remove all styling from p1
    this.p1 = this.lyrics;
  }

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

  loadLyricsIf(){
    if (this.statusClass10 != "transparent"){
      this.quote = "";
      this.getLyrics();
      this.activeChunk = 0;
      this.p1 = "";
      //document.getElementById('result')!.style.cssText = 'height:100px';
    }
  }

  getLyrics() {
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

    localStorage.getItem('showArtist') === 'false' ? this.blurArtist() : this.unblurArtist();    
    localStorage.getItem('showTitle') === 'false' ? this.blurTitle() : this.unblurTitle();    
    
    this.randomNumber = Math.floor(Math.random() * this.allTracks.length); //e.g. 36
    // SET the artist and title here (random choice from array)
    this.artistToSearch = this.allTracks[this.randomNumber].artist;
    this.titleToSearch = this.allTracks[this.randomNumber].title;
    this.titleToSearch = this.titleToSearch.split("-")[0];
    this.titleToSearch = this.titleToSearch.split("&")[0];
    this.titleToSearch = this.titleToSearch.split("(")[0];

    this.allTracks.splice(this.randomNumber, 1); //remove the used object from the array
    if (this.allTracks.length === 0) {
      this.allTracks= [...this.allTracksCopy]; // reset the LyricList array to original state
    } 

    //FORCE A CERTAIN SONG TO DISPLAY HERE :-)))))
    // this.titleToSearch = "wild live'";
    // this.artistToSearch = "Chris Isaak";
    this.getSongs3();
  }

  formatLyrics (quote: string | undefined, title: string, chunkToShow: number){ //format quote for displaying it correctly
    this.formatted = false;
    quote = quote?.split("******")[0];
    console.log("QUOOOOOOOTE: ", quote);

    let lineFeedPositions = this.listUpLinefeeds();
    let doubleLineBreaks: any = this.listUpDoubleLineBreaks(lineFeedPositions);
    this.lyrics = this.quote.substring(0, doubleLineBreaks[chunkToShow]); //SHOWCHUNK 0!!

    // try replacing all titles in the quote with a blur
    this.p1= this.lyrics;
    //console.log("p1 and title: ", this.p1, this.titleToSearch);
    if (localStorage.getItem('showTitle') === 'false') {
      const reg = new RegExp(this.titleToSearch, "gi");
      this.p1 = this.p1.replace(reg,`<b>${this.titleToSearch}</b>`);
      this.p1= `<style> b {color: black; font-weight:400; filter: blur(6px);} </style>` + this.p1;
    }
    //return this.lyrics;
  }

  listUpLinefeeds() {
    let lineFeedPositions = [];
    let nextLineFeedPosition = this.quote.indexOf("\n");
    while (nextLineFeedPosition >= 0) {
      lineFeedPositions.push(nextLineFeedPosition);
      nextLineFeedPosition = this.quote.indexOf("\n", nextLineFeedPosition + 1);
    }
    return lineFeedPositions;
  }

  listUpDoubleLineBreaks(lineFeedPositions: any){
    let doubleLineBreaks = [];
    for (let position = 0; position < lineFeedPositions.length; position++) {
      const x1 = lineFeedPositions[position];
      const x2 = lineFeedPositions[position + 1];
      if (x2 - x1 === 1) 
        doubleLineBreaks.push(x1);
    }
    return doubleLineBreaks;
  }

  moreChunks(){
    this.activeChunk++;
    this.formatLyrics(this.quote, this.title, this.activeChunk);
  }

  getSongs3(){
    this.apiService.GetMMTrackLyrics(this.titleToSearch, this.artistToSearch).subscribe({
      next: (response: any) => {
        if (response.message.header.status_code == 404 || 
                  response.message.body.lyrics.lyrics_body.length == 0){
              this.quote = "";
              this.getLyrics();
        } else {
          console.log(response.message.body.lyrics.lyrics_body);
          this.quote = response.message.body.lyrics.lyrics_body;
        }},
      error: (err: any) => {
        console.log(err);
        console.log("we are in error");
      },
      complete: () => {
        this.formatLyrics(this.quote, this.titleToSearch, this.activeChunk);
        this.title = this.titleToSearch;
        this.artist = this.artistToSearch;
      }
    })
  }
}