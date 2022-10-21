import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lyric, Performer } from './second-page/second-page.component';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {
    
   }

  GetPerformers = (q : string) => {
    this.http.get<Performer[]>(
      `https://localhost:5001/lyrics/performers?SearchQuery=${q}`
      );
   }

  AddLyric = (_performerId: number, _words: string, _songTitle: string, ) => {
    return this.http.post(
      'https://localhost:5001/lyrics/'+ _performerId
        , {words: _words, songTitle: _songTitle})
  }

  AddPerformer = (_name: string) => {
    console.log("in api service Add Performer");
    return this.http.post(
      'https://localhost:5001/lyrics/performers/', {name: _name});
  }
}
