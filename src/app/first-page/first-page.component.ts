import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, VERSION, ViewChild, Renderer2 } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { debounceTime, Observable, startWith, switchMap } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ApiService } from '../api.service';
import { MatDialog } from '@angular/material/dialog';
import { ReviewLyricsDialogComponent } from '../reviewLyrics-dialog/review-lyrics-dialog/review-lyrics-dialog.component';
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
  lyrics: string;
  lyrics1: string;
  value = 'Clear me';
  songtitle : string = "";
  title : any;
  @ViewChild("lyric-card") background : ElementRef;
  random_color: string;
  
  constructor(private client: HttpClient, public apiService: ApiService, public dialog: MatDialog,
    public el: ElementRef, public renderer: Renderer2) {  
      this.client.get<Lyric>(
        `https://lyricslover.azurewebsites.net/lyrics/random`
        //`https://localhost:5001/lyrics/random`
        )
      .subscribe((response : any) => {
        console.log(response.quote);
          this.lyrics = response.quote.replaceAll('.', '\n');
          this.lyrics = this.lyrics.replaceAll(',', '\n');
          this.songtitle = response.songTitle;
          this.performerName = response.performer;
        });
      console.log(this.lyrics);

      renderer.listen('document', 'click', (event) => {
        console.log(event.target);
        event.target.style.color = 'rgb(39, 7, 81)';
      })

      var colors = ['##E497DA', '#DFF67F', '#B2F8F4', '#B2E2F8', '#CEB2F8',
    '@FBDEFF', '#FFDEED','##F5A8A0', '#F5E2A0' ];
      this.random_color = colors[Math.floor(Math.random() * colors.length)];
      console.log("colour" + this.random_color);
      // renderer.setStyle(HTMLTextAreaElement, "color", random_color);

      //this.background.nativeElement.setStyle("backgron")

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

  reloadCurrentPage() {
    window.location.reload();
   }

  ngOnInit(): void {
    
  }

}
