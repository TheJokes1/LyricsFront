import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lyric, Performer } from './second-page/second-page.component'; 
import { HttpHeaders } from '@angular/common/http';

const headers= new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', '*');

@Injectable({
  providedIn: 'root'
})


export class ApiService {
  //baseUrl: string = `https://localhost:5001/`;
  baseUrl: string = `https://lyricslover.azurewebsites.net/`;

  constructor(private http: HttpClient) {
  }

  GetRandomQuote = () => {
    return this.http.get<Lyric>(
        this.baseUrl +`lyrics/random/`
        )
  }

  GetPerformers = (q : string) => {
    this.http.get<Performer[]>(
      this.baseUrl + `lyrics/performers?SearchQuery=${q}`
      ),
      {headers: headers};
   }

  AddLyric = (_performerId: number, _words: string, _songTitle: string, ) => {
    return this.http.post(
      this.baseUrl + `lyrics/`
      + _performerId, {words: _words, songTitle: _songTitle}, )
  }

  AddPerformer = (_name: string) => {
    console.log("in api service Add Performer");
    return this.http.post(
      this.baseUrl + `lyrics/performers/`
      , {name: _name},
      {observe: 'response'}
)
  .subscribe(response => {
    // You can access status:
    console.log(response);
    // Or any other header:
    console.log(response.headers.get('X-Custom-Header'));
  });;
  }
}
