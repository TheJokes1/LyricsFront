import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild, Renderer2, ViewChildren } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { debounceTime, Observable, startWith, switchMap } from 'rxjs';
import { ApiService } from '../services/api.service';
import { MatDialog } from '@angular/material/dialog';
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
  selector: 'app-first-page',
  templateUrl: './first-page.component.html',
  styleUrls: ['./first-page.component.css']
})
export class FirstPageComponent implements OnInit{

  disablePerfomer: boolean = false;
  disableButton: boolean = true;
  makeFilter = new FormControl('');
  performerName? : string;
  iD: number = 0;
  lyrics: any;
  lyrics1: string;
  songtitle : string = "";
  title : any;
  usedLyricIds: number[] = new Array();
  haveToReload: boolean= false;

  statusClass1: string = "transparent";
  statusClass2: string = "400"
  statusClass3: string = "0 0 13px #000;"
  statusClass10: string = "transparent";
  statusClass20: string = "400"
  statusClass30: string = "0 0 13px #000;" 
  random_color: string;
  quote$: Observable<Lyric>;
  
  constructor(public apiService: ApiService, public dialog: MatDialog,
    public el: ElementRef, public renderer: Renderer2) {  
      this.quote$ = this.apiService.GetRandomQuote;
      this.quote$.subscribe(response => {
          this.lyrics = response?.quote?.replaceAll('.', '\n');
          this.songtitle = response.songTitle;
          this.performerName = response.performer;
          console.log("in constructor: ", response.performer, " And: ",response.lyricId);
          this.usedLyricIds.push(response.lyricId);
        });
            
  
      var colors = ['#E497DA', '#DFF67F', '#B2F8F4', '#B2E2F8', '#CEB2F8',
        '#FBDEFF', '#FFDEED','#F5A8A0', '#F5E2A0','#F9A02C'];
      this.random_color = colors[Math.floor(Math.random() * colors.length)];

     this.renderer.listen('document', 'click', (event) => {
      //console.log("event: ", event);
      if (event.target.id == "perf")         
        {
          this.statusClass1 = "rgb(39, 7, 181)"
          this.statusClass2 = "850";
          this.statusClass3 = "none";
        }
      else if (event.target.id == "titled"){
          this.statusClass10 = "rgb(39, 7, 181)"
          this.statusClass20 = "850";
          this.statusClass30 = "none";
      }
      else if (event.target.localName == "div"){
        this.statusClass1 = "rgb(39, 7, 181)"
        this.statusClass2 = "850";
        this.statusClass3 = "none";
        this.statusClass10 = "rgb(39, 7, 181)"
        this.statusClass20 = "850";
        this.statusClass30 = "none";
      }
    })
  }

  ngOnInit() {
  }

  onSelection(perf: Performer){
    this.performerName = perf.name;
    this.makeFilter.disable;
    this.disableButton = false;
    console.log(perf.name, perf.performerId);
    this.iD = perf.performerId;
  }

  changePerformer(){
    this.disableButton = true;
  }

  checkLyricId(id: number): boolean {
    this.haveToReload = false;
    this.usedLyricIds.find(element => {
      if (element == id)
      {
        this.haveToReload = true;
        return true;
      } 
      else 
      {
        this.haveToReload = false
        return false;
      }
    });
    return this.haveToReload;
  }

  loadLyrics() {
    this.statusClass1 = "transparent";
    this.statusClass2 = "400";
    this.statusClass3 = "0 0 13px #000";
    this.statusClass10 = "transparent";
    this.statusClass20 = "400";
    this.statusClass30 = "0 0 13px #000";
    this.quote$ = this.apiService.GetRandomQuote;
    this.quote$.subscribe(response => {
        if (this.checkLyricId(response.lyricId) == true){ 
          //console.log(this.usedLyricIds);
          //console.log("RELOADING: ", response.lyricId);
          this.loadLyrics();
        }
        else {
          //console.log("printing goodies");
          this.lyrics = response?.quote?.replaceAll('.', '\n');
          //this.lyrics = this.lyrics.replaceAll(',', '\n');
          this.songtitle = response.songTitle;
          this.performerName = response.performer;
          this.usedLyricIds.push(response.lyricId);
          var colors = ['#E497DA', '#DFF67F', '#B2F8F4', '#B2E2F8', '#CEB2F8',
            '#FBDEFF', '#FFDEED','#F5A8A0', '#F5E2A0','#F9A02C'];
          this.random_color = colors[Math.floor(Math.random() * colors.length)];
          // renderer.setStyle(HTMLTextAreaElement, "color", random_color);
        }
      });

    
   }
}
