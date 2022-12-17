import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpParams } from '@angular/common/http';
import { buffer, Observable } from 'rxjs';
import { Performer } from '../second-page/second-page.component'; 
import { HttpHeaders } from '@angular/common/http';
import { Lyric } from '../lyric';
import { Buffer } from 'buffer';
//import { AllSpotLinks } from '../allSpotLinks';

// const headers= new HttpHeaders()
//   .set('content-type', 'application/json')
//   .set('Access-Control-Allow-Origin', '*');

@Injectable({
  providedIn: 'root'
})

@Injectable()
export class ApiService {

  baseUrl: string = `https://localhost:5001/api/`;
  //baseUrl: string = `https://lyricslover.azurewebsites.net/`;
  
  constructor(private http: HttpClient) {
  }

  // get GetRandomQuote() :Observable<Lyric> {
  //   return this.http.get<Lyric>(
  //       this.baseUrl +`lyrics/random/`
  //       )
  // }

  GetPerformers = (q : string) => {
    this.http.get<Performer[]>(
      this.baseUrl + `lyrics/performers?SearchQuery=${q}`
      )
   }

   GetLyrics = (language: string) => {
    return this.http.get<Lyric[]>(
      this.baseUrl + `lyrics?language=${language}`
    )
   }

   GetLyric = (q : number) => {
    return this.http.get<Lyric>(
      this.baseUrl + `lyrics/${q}`
      )
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

  AddSpotLink = (_id: number, _spotLink: string, _imageUrl: string, 
    _previewLink: string, _popularity: number, _releaseDate: string) => {
    return this.http.put(
      this.baseUrl + `lyrics/put/${_id}`, 
      {spotLink: _spotLink, imageUrl: _imageUrl, previewLink: _previewLink,
        popularity: _popularity, releaseDate: _releaseDate} , {observe: 'response'}
    )
  }

  GetAccessToken = () => { // API does the call to Spotify
    return this.http.post( 
      this.baseUrl + `SpotController/`,
      {observe: 'response'}
    )
  }

  getSpotifyInfo = (token: any, performer: any, title: any) => { //call to Spotify
    let headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
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
  
  


