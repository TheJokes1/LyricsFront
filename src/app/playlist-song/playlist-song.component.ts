import { Component, Pipe, PipeTransform, Renderer2 } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from '../services/data.service';
import { ApiService } from '../services/api.service';
import { Lyric } from '../Shared/Lyric';

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
  random_color2: string;
  titlesColor: string;
  statusClass1: any;
  statusClass2: string;
  statusClass3: string;
  statusClass20: string;
  statusClass30: string;
  statusClass10: any;
  randomNumber: number;
  lyricId: any;
  lyricListIds: number[] = new Array();
  quote: string = "";
  showImage: any= false;
  loadedLyric: Lyric = {} as Lyric;  
  lyrics: any;
  p1: any;
  //chosenPlaylist: Playlist = {} as Playlist;
  chosenPlaylist: string;
  tracks: Array<{artist: string, title: string}> = [];
  baseUrl: string = 'https://api.musixmatch.com/ws/1.1/';
  artist: string;
  artistToSearch: any;
  title: string;
  titleToSearch: any;
  allTracks: any;
  allTracksCopy: Array<{artist: '', title: ''}> = [];
  activeChunk: number = 0;
  titlePlaylist: string;
  choice1: any = "";
  choice2: any = "ttt";
  choice3: any = "ttt";
  showArtist: boolean;
  numberOfSongs: number;
  random2: number;
  random3: number;

  constructor(private renderer: Renderer2, public dataService: DataService, private apiService: ApiService) {
    this.allTracks = this.dataService.tracksPlaylist; //Array
    for (let index = 0; index < this.dataService.tracksPlaylist.length; index++) {
        const element = this.dataService.tracksPlaylist[index];
        this.allTracks[index] = element;
        //this.allTracks[index].artist = this.allTracks[index].artist.split("&")[0];
        this.allTracks[index].artist = this.allTracks[index].artist.split("(")[0];
        this.allTracks[index].title = this.allTracks[index].title.split("-")[0];
        this.allTracks[index].title = this.allTracks[index].title.split("&")[0];
        this.allTracks[index].title = this.allTracks[index].title.split("(")[0];
      }
    this.titlePlaylist = this.dataService.chosenPlaylist.name; //Object.name
    this.allTracksCopy = [...this.allTracks];
    console.log("copy 1: ", this.allTracksCopy);
    this.numberOfSongs = this.allTracksCopy.length;

    if (localStorage.getItem('showArtist') == 'true'){
      this.showArtist = true;
      //this.unblurArtist();
    } else {
      this.showArtist = false;
      //this.unblurTitle();
    }
   
    this.getLyrics();
    this.loadedLyric.spotLink = "";
    this.loadedLyric.imageUrl = "";
    this.renderer.listen('document', 'click', (event) => {
      if (event.target.id == "perf") {
        this.unblurArtist();
        //this.showImage = !this.showImage;
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
      if (this.allTracks.length === 0) {
        console.log("we need a RESET");
        this.allTracks= [...this.allTracksCopy]; // reset the LyricList array to original state
        this.chooseArtist();
        this.getSongs3();
      } else {
        this.quote = "";
        this.getLyrics();
        this.activeChunk = 0;
        this.p1 = "";
        //document.getElementById('result')!.style.cssText = 'height:100px';
      }
    }
  }

  makeGuesses(){
    this.choice2 = "";
    this.choice3 = "";
    
    if (this.showArtist){
      this.random2 = Math.floor(Math.random() * this.numberOfSongs);
      this.choice2 = this.allTracksCopy[this.random2].title; 
      this.random3 = this.random2;
      while (this.random3 == this.random2 || this.random3 == this.randomNumber){
        this.random3 = Math.floor(Math.random() * this.numberOfSongs);
        this.choice3 = this.allTracksCopy[this.random3].title;
      }
    } else { //CHANGE your checks: compare the strings/contents of choice1, 2, 3
      this.random2 = Math.floor(Math.random() * this.numberOfSongs);
      this.choice2 = this.allTracksCopy[this.random2].artist;

      this.random3 = this.random2;
      while (this.random3 == this.random2 || this.random3 == this.randomNumber){
        this.random3 = Math.floor(Math.random() * this.numberOfSongs);
        this.choice3 = this.allTracksCopy[this.random3].artist;
      }
    }

    console.log("choices", this.choice1, this.choice2, this.choice3);

    // Create an array with the values of the variables
    let choices = [this.choice1, this.choice2, this.choice3];
    // Shuffle the array using the Fisher-Yates algorithm
    for (let i = choices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [choices[i], choices[j]] = [choices[j], choices[i]];
    }
    // Assign the shuffled values back to the variables
    [this.choice1, this.choice2, this.choice3] = choices;

    this.allTracks.splice(this.randomNumber, 1);
  }

  getLyrics() { //Choose a random song from the playlist + call the MM api to search lyrics.
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
    this.random_color2 = colors[Math.floor(Math.random() * colors.length)];
    this.titlesColor = titlesColors[Math.floor(Math.random() * titlesColors.length)];

    this.showArtist === false ? this.blurArtist() : this.unblurArtist();   
    this.showArtist === false ? this.unblurTitle() : this.blurTitle();

    this.chooseArtist();
    //FORCE A CERTAIN SONG TO DISPLAY HERE :-)))))
    // this.titleToSearch = "wild live'";
    // this.artistToSearch = "Chris Isaak";
    this.getSongs3();
  }
  
  chooseArtist(){
    this.artistToSearch = undefined;
    while (!this.artistToSearch) { // I built it in a WHILE loop because we had some undefineds..
      this.randomNumber = Math.floor(Math.random() * this.allTracks.length); //e.g. 36
      // SET the artist and title here (random choice from array)
      //console.log("deze willen we: ", this.allTracks[this.randomNumber].artist);
      this.artistToSearch = this.allTracks[this.randomNumber].artist;
      this.titleToSearch = this.allTracks[this.randomNumber].title;
      this.showArtist ? this.choice1 = this.allTracks[this.randomNumber].title : this.choice1 = this.allTracks[this.randomNumber].artist;
      if (this.artistToSearch && this.titleToSearch) {
        this.makeGuesses();
       //remove the used object from the array
      } else this.chooseArtist();
      console.log("To Search: ", this.randomNumber, this.artistToSearch, this.titleToSearch);
    }
  }
  
  formatLyrics (quote: string | undefined, title: string, chunkToShow: number){ //format quote for displaying it correctly
    quote = quote?.split("******")[0];

    let lineFeedPositions = this.listUpLinefeeds();
    let doubleLineBreaks: any = this.listUpDoubleLineBreaks(lineFeedPositions);
    this.lyrics = this.quote.substring(0, doubleLineBreaks[chunkToShow]); //SHOWCHUNK 0!!
    //console.log("after chuncking: ", this.lyrics);

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
    this.artist = "";
    this.apiService.GetMMTrackLyrics(this.titleToSearch, this.artistToSearch).subscribe({
      next: (response: any) => {
        console.log("MMy response is: ", response);
        if (response.message.header.status_code == 404 || 
            response.message.body.lyrics.lyrics_body.length == 0){
          console.log("404 on ", this.artistToSearch, this.titleToSearch);
          if (this.allTracks.length === 0) {
            console.log("we need a RESET");
            this.allTracks= [...this.allTracksCopy]; // reset the LyricList array to original state
            this.chooseArtist();
            this.getSongs3();
            } else {
              this.quote = "";
              this.getLyrics();
            }
          } else {
            console.log("SUCCESS: ", response.message.body.lyrics.lyrics_body.substring(0, 40));
            this.quote = response.message.body.lyrics.lyrics_body;
            this.formatLyrics(this.quote, this.titleToSearch, this.activeChunk);
            this.title = this.titleToSearch;
            this.artist = this.artistToSearch;
        }},
      error: (err: any) => {
        console.log(err);
        console.log("we are in error");
      },
      complete: () => {
      }
    })
  }
}