import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, VERSION, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { debounceTime, Observable, startWith, switchMap } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ApiService } from './api.service';


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
  iD: number = 0;
  newLyric?: Lyric;

  constructor(private client: HttpClient, public apiService: ApiService) {
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
    this.makeFilter.disable;
    this.disableButton = false;
    console.log(perf.name, perf.performerId);
    this.iD = perf.performerId;


  }

  onAddLyrics() {
    console.log(this.lyrics);
    console.log(this.songTitle);
    console.log(this.iD);
    this.newLyric= {words : this.lyrics, songTitle: this.songTitle, performerId: this.iD}
    this.apiService.AddLyric(this.newLyric).subscribe((response: any) => {
      console.log(response)
    });
  }

}
