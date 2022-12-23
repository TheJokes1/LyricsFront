import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, VERSION, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { asyncScheduler, debounceTime, merge, Observable, startWith, switchMap } from 'rxjs';
import { ApiService } from '../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { ReviewLyricsDialogComponent } from '../reviewLyrics-dialog/review-lyrics-dialog/review-lyrics-dialog.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddPerformerDialogComponent } from '../add-performer-dialog/add-performer-dialog.component';
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

  constructor(public http: HttpClient, public apiService: ApiService, public dialog: MatDialog,
    public el: ElementRef, public renderer: Renderer2) {
    this.performers = this.makeFilter.valueChanges
      .pipe(
        startWith(''),
        debounceTime(200),
        switchMap(q =>
          this.http.get<Performer[]>(
          `https://lyricslover.azurewebsites.net/api/lyrics/performers?SearchQuery=${q}`
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
    this.newTitle = this.formatTitle(this.songTitle);
    this.newLyric = this.lyrics;
    
    this.apiService.getSpotifyInfo(this.token, this.performerName, this.songTitle).subscribe({
      next: (response:any) => {
        console.log("spotify says:" ,response);
        this.loadedLyric.spotLink= response.tracks.items[0].external_urls.spotify;
        this.loadedLyric.previewLink = response.tracks.items[0].preview_url;
        this.loadedLyric.releaseDate = response.tracks.items[0].album.release_date;
        this.loadedLyric.imageUrl = response.tracks.items[0].album.images[1].url;
        this.loadedLyric.popularity = this.getPopularity(response);
      },
      error: error => {
        this.loadedLyric.spotLink="";
        console.log(error);
      },
      complete: () => {
        this.apiService.AddLyric(this.idPerformer, this.newLyric, this.newTitle, 
          this.loadedLyric.spotLink!).subscribe((response: any) => {
          {
            this.reviewLyrics(this.newLyric, this.newTitle);
          }
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
      if (highest>57) i=i+20;
    } 
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
    // var newText = lyric.replaceAll("." , "\n");
    // return newText;
  }

}