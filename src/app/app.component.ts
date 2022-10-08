import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, VERSION, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { debounceTime, Observable, startWith, switchMap } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ApiService } from './api.service';
import { MatDialog } from '@angular/material/dialog';
import { ReviewLyricsDialogComponent } from './reviewLyrics-dialog/review-lyrics-dialog/review-lyrics-dialog.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


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


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent
{
  disablePerformer: boolean = false;
  disableButton: boolean = true;
  makeFilter = new FormControl('');
  performers : Observable<Performer[]>;
  lyrics : string ='';
  songTitle: string ='';
  performerName? : string;
  iD: number = 0;
  dLyric : string ='';
  dSongTitle : string ='';


  constructor(private client: HttpClient, public apiService: ApiService, public dialog: MatDialog) {
    this.performers = this.makeFilter.valueChanges
      .pipe(
        startWith(''),
        debounceTime(400),
        switchMap(q =>
          this.client.get<Performer[]>(
          `https://localhost:5001/lyrics/performers?SearchQuery=${q}`
          )));
  }

  onSelection(perf: Performer){
    this.performerName = perf.name;
    this.makeFilter.disable;
    this.disableButton = false;
    console.log(perf.name, perf.performerId);
    this.iD = perf.performerId;
  }

  onAddLyrics(lyrics: string, songTitle: string) {
    console.log(this.iD, this.lyrics, this.songTitle, lyrics, songTitle);
    //this.reviewLyrics(lyrics, songTitle);


    this.apiService.AddLyric( this.iD, this.lyrics, this.songTitle).subscribe((response: any) => {
      console.log(response)
    });
  }

  reviewLyrics(lyrics: string, songTitle: string){
    const checked = this.dialog.open(ReviewLyricsDialogComponent ,{
      data : { lyrics: lyrics, songTitle: songTitle, performerName : this.performerName }
    });
    checked.afterClosed().subscribe(result => console.log(result));
  }

}
