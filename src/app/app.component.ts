import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, VERSION, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { debounceTime, Observable, startWith, switchMap } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';


export interface Lyric {
  lyricId: number;
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
  @ViewChild("labelType") labelType: ElementRef = {} as ElementRef;
  displayText : boolean = false;
  disablePerformer: boolean = false;
  makeFilter = new FormControl('');
  performers : Observable<Performer[]>;

  constructor(private client: HttpClient) {
    this.performers = this.makeFilter.valueChanges
      .pipe(
        startWith(''),
        debounceTime(400),
        switchMap(q => this.client.get<Performer[]>(
          `https://localhost:5001/lyrics/performers?SearchQuery=${q}`
          )))
  }

  onSelection(perf: Performer){
    this.makeFilter.disable;
    console.log(perf.name, perf.performerId);
    //this.labelType.nativeElement.innerHTML = "I am changed by ElementRef & ViewChild";
    this.displayText = true;

  }


  ngOnInit() {

    this.makeFilter.valueChanges
      .pipe, switchMap( f => this.client.get<Performer[]>(
        `https://localhost:5001/lyrics/performers?SearchQuery=""`
      ))
  }
}
