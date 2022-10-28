import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, VERSION, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { debounceTime, merge, Observable, startWith, switchMap } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ApiService } from '../api.service';
import { MatDialog } from '@angular/material/dialog';
import { ReviewLyricsDialogComponent } from '../reviewLyrics-dialog/review-lyrics-dialog/review-lyrics-dialog.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddPerformerDialogComponent } from '../add-performer-dialog/add-performer-dialog.component';
import { Element } from '@angular/compiler';
import { MatInput } from '@angular/material/input';
import { HttpHeaders } from '@angular/common/http';



export interface DialogLyricData {
  dLyrics: string;
  dSongTitle: string;
}

export interface Lyric {
  lyricId?: number;
  words: string;
  songTitle: string;
  performerId: number;
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

const headers= new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', '*');

@Component({
  selector: 'app-second-page',
  templateUrl: './second-page.component.html',
  styleUrls: ['./second-page.component.css']
})
export class SecondPageComponent implements OnInit, AfterViewInit
{
  @ViewChild('mySelect') mySelect : any;
  disableButton: boolean = true;
  makeFilter = new FormControl('');
  performers? : Observable<Performer[]>;
  performer: string =""
  lyrics : string ='';
  songTitle: string ='';
  performerName? : string;
  iD: number = 0;

  dLyric : string ='';
  dSongTitle : string ='';
  allPerformers : Observable<Performer[]>;
  allP: Performer[] =[];
  panelOpen: boolean = true;
  addPHidden: boolean = false;
  newTitle: string;
  newLyric: string;
  stringje : string ="";

  constructor(public client: HttpClient, public apiService: ApiService, public dialog: MatDialog,
    public el: ElementRef, public renderer: Renderer2) {
    this.performers = this.makeFilter.valueChanges
      .pipe(
        startWith(''),
        debounceTime(400),
        switchMap(q =>
          this.client.get<Performer[]>(
          `https://lyricslover.azurewebsites.net/lyrics/performers?SearchQuery=${q}`
          //`https://localhost:5001/lyrics/performers?searchQuery=${q}`
          )));

    // this.performers = this.makeFilter.valueChanges
    //   .pipe(
    //       startWith(''),
    //       debounceTime(200),
    //       map(q => this._filter(q)));
  }

  ngOnInit(){
    // this.performers = this.client.get<Performer[]>(
    //   //`https://lyricslover.azurewebsites.net/lyrics/performers`
    //  `https://localhost:5001/lyrics/performers`
    //  //,{headers: headers}
    // );
  }

  private _filter (value: any): Performer[] {
    const filterValue = value.toLowerCase();
    return this.allP.filter(options => options.name.toLowerCase().includes(filterValue))
  }

  ngAfterViewInit() {
  }


  onSelection(perf: Performer){
    this.performerName = perf.name;
    this.makeFilter.disable;
    if (this.lyrics.length>=5 && this.songTitle.length>=2) this.disableButton = false;
    console.log(perf.name, perf.performerId);
    this.iD = perf.performerId;
    this.addPHidden = true;
  }

  onKeypressEvent(){
    this.addPHidden = false;
    this.disableButton= true;
    this.checkStatusFields(); 
  }

  onKeypressLyric(){
    this.checkStatusFields();
  }

  onKeypressTitle(){
    this.checkStatusFields();
  }

  onClosedEvent(){
    console.log("closed it");
  }

  checkStatusFields(){
    if (this.lyrics.length>=5 && this.songTitle.length>=2 && this.addPHidden) 
      this.disableButton = false
    else this.disableButton = true;
  }

  onAddLyrics(lyrics: string, songTitle: string) {
    this.newTitle = this.formatTitle(this.songTitle);
    this.newLyric = this.formatLyric(this.lyrics)
    this.apiService.AddLyric( this.iD, this.newLyric, this.newTitle).subscribe((response: any) => {
      {
        this.reviewLyrics(this.newLyric, this.newTitle);
        console.log("after dialog" + response);
        this.performer = "";
        this.lyrics = "";
        this.songTitle = "";
      }
    });
  }

  onAddPerformer(){
    this.dialog.open(AddPerformerDialogComponent ,{
      data : { performerName : this.performer }
    }).afterClosed().subscribe
      (result => {
        console.log("name given: " + typeof(result));
        if (result != undefined) this.addPerformer(result);
      });
  }

  addPerformer(name: string){
    this.apiService.AddPerformer(name);
  }

  reviewLyrics(lyrics: string, songTitle: string){
    const checked = this.dialog.open(ReviewLyricsDialogComponent ,{
      data : { lyrics: lyrics, songTitle: songTitle, performerName : this.performer }
    });
    checked.afterClosed().subscribe(result => console.log(result));
  }

  formatTitle(title: string){
    var test = title.split(" ");
    var nieuwe = test.map(element => 
      element.substring(0,1).toUpperCase() + element.slice(1));
    var nieuwere = nieuwe.join(" ");
    console.log(nieuwere);
    return nieuwere;
  }

  formatLyric(lyric: string){
    var newText = lyric.replaceAll("." , "\n");
    return newText;
  }

}

