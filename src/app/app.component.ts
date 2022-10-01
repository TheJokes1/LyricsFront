import { HttpClient } from '@angular/common/http';
import { Component, OnInit, VERSION } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, Observable, startWith, switchMap } from 'rxjs';



export interface Lyric {
  lyricId: number;
  words: string;
  songTitle: string;
  performerId: number;
}

export interface Performer {
  performerId: number;
  name: string;
  lyrics: Lyric[];
  favouritePerformers: FavouritePerformer[];
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

export class AppComponent //implements OnInit
{
  makeFilter = new FormControl('');
  performers : Observable<Performer[]>;

  constructor(private client: HttpClient) {
    console.log('helloo');
    this.performers = this.makeFilter.valueChanges
      .pipe(
        startWith(''),
        debounceTime(400),
        switchMap(q => this.client.get<Performer[]>(
          `https://localhost:5001/lyrics/performers?SearchQuery=${q}`
          )))
  }
}
