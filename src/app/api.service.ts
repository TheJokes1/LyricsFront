import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lyric, Performer } from './app.component';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {
    console.log("in api service");
   }

   GetPerformers = (q : string) => {
    this.http.get<Performer[]>(
      `https://localhost:5001/lyrics/performers?SearchQuery=${q}`
      );
   }

  AddLyric = (_performerId: number, _words: string, _songTitle: string, ) => {
    return this.http.post(
      'https://localhost:5001/lyrics/'+ _performerId
        , {words: _words, songTitle: _songTitle})};
}
