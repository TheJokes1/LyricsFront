import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, VERSION, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { asyncScheduler, debounceTime, merge, Observable, startWith, switchMap } from 'rxjs';
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
  @ViewChild('input') input : ElementRef;
  disableButton : boolean = true;
  makeFilter = new FormControl('');
  performers? : Observable<Performer[]>;
  performer : string = "";
  lyrics : string ='';
  songTitle : string ='';
  performerName? : string;
  iD : number = 0;

  dLyric : string ='';
  dSongTitle : string ='';
  allPerformers : Observable<Performer[]>;
  allP : Performer[] =[];
  panelOpen : boolean;
  addPHidden : boolean = true;
  newTitle : string;
  newLyric : string;
  stringje : string ="";
  selectionMade : boolean= false;

  constructor(public http: HttpClient, public apiService: ApiService, public dialog: MatDialog,
    public el: ElementRef, public renderer: Renderer2) {
    this.performers = this.makeFilter.valueChanges
      .pipe(
        startWith(''),
        debounceTime(200),
        switchMap(q =>
          this.http.get<Performer[]>(
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

  // private _filter (value: any): Performer[] {
  //   const filterValue = value.toLowerCase();
  //   return this.allP.filter(options => options.name.toLowerCase().includes(filterValue))
  // }

  ngAfterViewInit() {
  }


  onSelection(perf: Performer){
    this.performer = perf.name;
    this.performerName = perf.name;
    this.makeFilter.disable;
    if (this.lyrics.length>=5 && this.songTitle.length>=2) this.disableButton = false;
    
    this.iD = perf.performerId;
    this.addPHidden = true;
    this.selectionMade = true;
    console.log(typeof(this.mySelect));
  }

  onKeypressEvent(code: any){
    this.performer = code;
    if (this.mySelect.isOpen) this.addPHidden= true;
    if (!this.mySelect.isOpen) this.addPHidden = false;
    console.log(this.mySelect.isOpen);
    this.checkStatusSaveButton();
    this.checkStatusPerformerButton();
    this.selectionMade = false;
  }

  onKeypressLyric(){
    this.checkStatusSaveButton();
  }

  onKeypressTitle(){
    this.checkStatusSaveButton();
  }

  checkStatusPerformerButton(){
    if (this.performer.length <= 2 || this.mySelect.isOpen) this.addPHidden = true
    else this.addPHidden = false;
  }

  checkStatusSaveButton(){
    console.log("DD open: " + this.mySelect.isOpen);
    if (this.lyrics.length>=5 && this.songTitle.length>=2
      && this.selectionMade)
      this.disableButton = false;
    else this.disableButton = true;
  }
  
  onAddLyrics(lyrics: string, songTitle: string) {
    this.newTitle = this.formatTitle(this.songTitle);
    this.newLyric = this.formatLyric(this.lyrics)
    this.apiService.AddLyric( this.iD, this.newLyric, this.newTitle).subscribe((response: any) => {
      {
        this.reviewLyrics(this.newLyric, this.newTitle);
        console.log("after dialog response: " + response);
        // this.lyrics = "";
        // this.songTitle = "";
        // this.input.nativeElement.value = " ";
        // this.disableButton = true;
      }
    });
  }

  onAddPerformer(){
    console.log("performer: " + this.performer);
    console.log("performerName: " + this.performerName);
    this.dialog.open(AddPerformerDialogComponent ,{
      data : { performerName : this.performer }
    }).afterClosed().subscribe
      (result => {
        console.log("name given: " + typeof(result));
        if (result != undefined) {
          this.addPerformer(result);
          //this.mySelect.nativeElement.value = "";
          //window.location.reload();
        }
      });
  }

  addPerformer(name: string){
    this.apiService.AddPerformer(name);
  }

  reviewLyrics(lyrics: string, songTitle: string){
    const checked = this.dialog.open(ReviewLyricsDialogComponent ,{
      data : { lyrics: lyrics, songTitle: songTitle, performerName : this.performer }
    });
    checked.afterClosed().subscribe(result => {
      console.log(result);
      window.location.reload();
    }); 
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

