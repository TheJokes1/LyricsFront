import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpParams } from '@angular/common/http';
import { buffer, Observable } from 'rxjs';
import { Performer } from '../second-page/second-page.component'; 
import { HttpHeaders } from '@angular/common/http';
import { Lyric } from '../lyric';
import { Buffer } from 'buffer';

const headers= new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', '*');


@Injectable({
  providedIn: 'root'
})

@Injectable()
export class ApiService {
  baseUrl: string = `https://localhost:5001/api/`;
  //baseUrl: string = `https://lyricslover.azurewebsites.net/api/`;
  client_id: string = '4c51f7e54bd546e7a04d4141ff59ce8f';
  client_secret: string = 'ed88fa0c5b4b480c92fc6ca3f982d617';

  constructor(private http: HttpClient) {
  }

  get GetRandomQuote() :Observable<Lyric> {
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

   GetLyric = (q : string) => {
    this.http.get<Lyric>(
      this.baseUrl + `lyrics/${q}`
      ),
      {headers: headers};
    }

  AddLyric = (_performerId: number, _words: string, _songTitle: string, _spotLink: string) => {
    return this.http.post(
      this.baseUrl + `lyrics/`
      + _performerId, {words: _words, songTitle: _songTitle, spotLink: _spotLink}, )
  }

  AddPerformer = (_name: string) => {
    return this.http.post(
      this.baseUrl + `lyrics/performers/`
      , {name: _name},
      {observe: 'response'}
    )
  }

  AddSpotLink = (_id: number, _link: string) => {
    return this.http.put(
      this.baseUrl + `lyrics/put/${_id}`, 
      {spotLink: _link} , {observe: 'response'}
    )
  }
  
  GetSpotifyCreds = () => {
    let headers = new HttpHeaders({"Content-Type": "application/x-www-form-urlencoded", "Authorization": "Basic " 
      + (btoa(this.client_id + ":" + this.client_secret))});
    let body = new HttpParams();
    body = body.append('grant_type', 'client_credentials');
    return this.http.post
      ('https://accounts.spotify.com/api/token', body.toString(), {headers: headers});
  }

  getSpotifyInfo = (token: any, performer: any, title: any) => {
    let headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    });
    const performerPlus = performer.replaceAll(' ', '+');
    const titlePlus = title.replaceAll(' ', '+');
    const urlSpot:string = 'https://api.spotify.com/v1/search?query=' + performerPlus + '+' + titlePlus + '&type=track&market=BE';

    return this.http.get( 
      urlSpot,
      { headers: headers }
    );
  };
} 
  
  


