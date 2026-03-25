import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Observable, startWith, map, switchMap, filter } from 'rxjs';
import { ApiService } from '../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { ReviewLyricsDialogComponent } from '../reviewLyrics-dialog/review-lyrics-dialog/review-lyrics-dialog.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddPerformerDialogComponent } from '../add-performer-dialog/add-performer-dialog.component';
import { Lyric } from '../Shared/Lyric';

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
  selector: 'app-second-page',
  templateUrl: './second-page.component.html',
  styleUrls: ['./second-page.component.css']
})


export class SecondPageComponent implements OnInit, AfterViewInit
{
  @ViewChild('mySelect') mySelect : any;
  @ViewChild('input') input : ElementRef;
  disableButton : boolean = true;
  makeFilter = new FormControl('');
  performers? : Observable<Performer[]>;
  performer : string = "";
  lyrics : string ='';
  songTitle : string ='';
  performerName? : string;
  idPerformer : number = 0;

  dLyric : string ='';
  dSongTitle : string ='';
  allPerformers : Observable<Performer[]>;
  allP : Performer[] =[];
  panelOpen : boolean;
  addPHidden : boolean = true;
  newTitle : string;
  newLyric : string;
  selectionMade : boolean= false;
  performer$? : Observable<any>;
  token: any;
  loadedLyric: Lyric = {} as Lyric;
  disableAddArtist : boolean = false;
  errorMessage : string = '';

  constructor(public http: HttpClient, public apiService: ApiService, public dialog: MatDialog,
    public el: ElementRef, public renderer: Renderer2) {
    this.performers = this.makeFilter.valueChanges
      .pipe(
        startWith(''),
        map(q => (q ?? '').toString().trim()), 
        debounceTime(200),
        filter(q => q.length >= 2),
        distinctUntilChanged(),
        switchMap(q =>
          this.http.get<Performer[]>(
          `https://lyrics-api-wlkl.onrender.com/api/performers?SearchQuery=${q}`
          //`https://localhost:5001/api/lyrics/performers?searchQuery=${q}`
          )));

    this.apiService.GetAccessToken().subscribe({
      next: (response: any) => {
        this.token= response.access_token;
      },
      error: error => console.log(error),
      complete : () => {}
    })
  }

  ngOnInit(){
  }

  ngAfterViewInit() {
  }


  onSelection(perf: Performer){
    this.performer = perf.name;
    this.performerName = perf.name;
    //this.makeFilter.disable;
    if (this.lyrics.length>=5 && this.songTitle.length>=2) this.disableButton = false;
    
    this.idPerformer = perf.performerId;
    this.selectionMade = true;
  }

  onKeypressArtist(code: any){
    this.performer = code;
    this.checkStatusSaveButton();
    this.selectionMade = false;
  }

  checkStatusSaveButton(){
    //console.log("DD open: " + this.mySelect.isOpen);
    if (this.lyrics.length>=5 && this.songTitle.length>=2
      && this.selectionMade)
      this.disableButton = false;
    else this.disableButton = true;
  }
  
 onAddLyrics(lyrics: string, songTitle: string) {
  this.newTitle = this.formatTitle(songTitle);
  this.newLyric  = this.formatLyric(lyrics);

  this.disableButton = true;
  this.disableAddArtist = true;

  // Forceer: geen spotify data voor nu
  this.loadedLyric.spotLink = null as any;       // of: null (als type het toelaat)
  this.loadedLyric.previewLink = null as any;
  this.loadedLyric.releaseDate = null as any;
  this.loadedLyric.imageUrl = null as any;
  this.loadedLyric.popularity = null as any;

  /*
  // TEMP OFF: Spotify/Musixmatch API changed
  this.apiService.getSpotifyInfo(this.token, this.performerName, this.songTitle).subscribe({
    next: (response: any) => {
      console.log("spotify says:", response);
      this.loadedLyric.spotLink     = response.tracks.items[0].external_urls.spotify;
      this.loadedLyric.previewLink  = response.tracks.items[0].preview_url;
      this.loadedLyric.releaseDate  = response.tracks.items[0].album.release_date;
      this.loadedLyric.imageUrl     = response.tracks.items[0].album.images[1].url;
      this.loadedLyric.popularity   = this.getPopularityAndDate(response);
    },
    error: error => {
      this.loadedLyric.spotLink = null;
      console.log(error);
    },
    complete: () => {
      // moved below
    }
  });
  */

  // Ga meteen lyrics opslaan zonder spotify links
  this.apiService.AddLyric(
    this.idPerformer,
    this.newLyric,
    this.newTitle,
    "" // 👈 spotLink: stuur expliciet NULL
  ).subscribe({
    next: (response: any) => {
      // TEMP OFF: geen AddSpotifyLinks call
      /*
      this.apiService.AddSpotifyLinks(
        response.lyricId!,
        this.loadedLyric.spotLink!,
        this.loadedLyric.imageUrl!,
        this.loadedLyric.previewLink,
        this.loadedLyric.popularity!,
        this.loadedLyric.releaseDate!
      ).subscribe();
      */

      // ✅ Dit moet blijven
      this.reviewLyrics(this.newLyric, this.newTitle);
    },
    error: (err) => {
      console.log(err);
      this.errorMessage = '❌ Opslaan mislukt. Probeer opnieuw.';
      this.disableButton = false;
      this.disableAddArtist = false;

      /*<p *ngIf="statusMessage" class="success">
        {{ statusMessage }}
      </p>

      <p *ngIf="errorMessage" class="error">
        {{ errorMessage }}
      </p>
      */
    }
  });
}

  getPopularityAndDate (response: any) : number {
    var highest = 2;
    var earliestDate = +response.tracks.items[0].album.release_date.substring(0,4);
    var limit = response.tracks.items.length;
    for (var i: any = 0; i<limit; i++){
      if (response.tracks.items[i].popularity > highest) {
        highest = response.tracks.items[i].popularity;
      } 
      if (+response.tracks.items[i].album.release_date.substring(0,4) < earliestDate
        && response.tracks.items[i].name.toLowerCase().includes(this.songTitle?.toLowerCase())
        && response.tracks.items[i].artists[0].name.toLowerCase().includes(this.performerName?.toLowerCase())) {
        earliestDate = +response.tracks.items[i].album.release_date.substring(0,4);
      }
      //if (highest>57) i=i+20;
    } 
    console.log("earliest date: ", earliestDate);
    this.loadedLyric.releaseDate = earliestDate.toString();
    return highest;
  };

  onAddPerformer(){
    if (!this.disableAddArtist){
    this.dialog.open(AddPerformerDialogComponent ,{
      data : { performerName : this.performer }
    }).afterClosed().subscribe
      (result => {
        if (result != undefined) {
          console.log(result);
          this.addPerformer(result);
          this.disableAddArtist = true;
        }
      });
    }
  }

  addPerformer(name: string){
    this.apiService.AddPerformer(name).subscribe({
      next: (response: any) => {
        this.makeFilter.setValue(name);
      },
      error: error => console.log(error),
      complete: () => {}
    })
  }

  reviewLyrics(lyrics: string, songTitle: string){
    const checked = this.dialog.open(ReviewLyricsDialogComponent, {
      data : { lyrics: lyrics, songTitle: songTitle, performerName : this.performer }
    });
    checked.afterClosed().subscribe(result => {
      console.log(result);
      //window.location.reload();
      this.lyrics = '';
      this.songTitle = '';
      this.makeFilter.setValue('');
    }); 
  }

  formatTitle(title: string){
    var test = title.split(" ");
    var nieuwe = test.map(element => 
      element.substring(0,1).toUpperCase() + element.slice(1));
    var nieuwere = nieuwe.join(" ");
    return nieuwere;
  }

  formatLyric(lyric: string){
    var newText = lyric.replaceAll("<" , "");
    var newText = newText.replaceAll(">" , "");
    return newText;
  }

}





// constructor(){
//   `https://lyricslover.azurewebsites.net/api/lyrics/performers?SearchQuery=${q}`
//    this.apiService.GetAccessToken()    VOOR SPOTIFY
// }

// onSelection(perf: Performer){ 
//    A performer is selected from the dropdown
// }

// onAddLyrics(lyrics: string, songTitle: string) {
//   ====> formatTitle();
//   this.apiService.getSpotifyInfo(){
//     next: (response:any) => {
//       fill in the spotify info from the response
//       ====> this.getPopularityAndDate
//     },
//     complete: () => {
//       this.apiService.AddLyric(){
//         this.apiService.AddSpotifyLinks();
//         ====> this.reviewLyrics(this.newLyric, this.newTitle); //dialog box for user to review lyrics
//     }}

// getPopularityAndDate (response: any) : number {
// };

// onAddPerformer(){  ====> called when user clicks on the add artist button
//    Dialog box for user to add a new performer
//    ====> this.addPerformer(result);
// }

// addPerformer(name: string){
//    this.apiService.AddPerformer(name).subscribe({
//    })
// }

// reviewLyrics(lyrics: string, songTitle: string){
//    Dialog box for user to review lyrics
// }

// formatTitle(title: string){
//    Uppercase first letter of each word
// }
