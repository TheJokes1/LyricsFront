import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpParams } from '@angular/common/http';
import { buffer, Observable } from 'rxjs';
import { Performer } from '../second-page/second-page.component'; 
import { HttpHeaders } from '@angular/common/http';
import { Lyric } from '../lyric';
//import { Buffer } from 'buffer';
//import { AllSpotLinks } from '../allSpotLinks';

// const headers= new HttpHeaders()
//   .set('content-type', 'application/json')
//   .set('Access-Control-Allow-Origin', '*');


@Injectable({
  providedIn: 'root'
})

@Injectable()
export class ApiService {

  //baseUrl: string = `https://localhost:5001/api/`;
  baseUrl: string = `https://lyricslover.azurewebsites.net/api/`;

  
  constructor(private http: HttpClient) {
  }

  GetPerformers = (q : string) => {
    this.http.get<Performer[]>(
      this.baseUrl + `lyrics/performers?SearchQuery=${q}`
      )
   }

   GetLyrics = (language: string, era: string, text: string) => {
    //console.log("API: language: " + language + " era: " + era + "" 
     // + " text: " + text);
    text = text.trim();
    text = "%20" + text + "%20";
    return this.http.get<Lyric[]>(
      this.baseUrl + `lyrics?language=${language}&releaseDate=${era}&SearchQueryTitle=${text}`
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

  AuthenticateWSpotify(url: string){
    window.location.href = url;
  }

  AddSpotifyLinks = (_id: number, _spotLink: string, _imageUrl: string, 
    _previewLink: string, _popularity: number, _releaseDate: string) => {
    return this.http.put(
      this.baseUrl + `lyrics/put/${_id}`, 
      {spotLink: _spotLink, imageUrl: _imageUrl, previewLink: _previewLink,
        popularity: _popularity, releaseDate: _releaseDate} , {observe: 'response'}
    )
  }

  GetAccessToken = () => { // Backend API does the call to Spotify
    return this.http.post( 
      this.baseUrl + `SpotController/`,
      {observe: 'response'}
    )
  }

  AuthSpotifyWithToken(code: any, redirect_uri : string){
     let headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + Buffer.from(code, 'base64')  //code.toString('base64').

    });
   
  }

  getSpotifyInfo = (token: any, performer: any, title: any) => { //call to Spotify to get info on 1 song
    let headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    });
    const performerPlus = performer.replaceAll(' ', '+');
    const titlePlus = title.replaceAll(' ', '+');
    const urlSpot: string = 'https://api.spotify.com/v1/search?query=' + performerPlus + '+' + titlePlus + '&type=track&market=BE';

    return this.http.get( 
      urlSpot,
      { headers: headers }
    );
  }

  getSpotifyUserId = (token: any) => {
    let headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    })
    const url: string = 'https://api.spotify.com/v1/me';

    return this.http.get(
      url,
      {headers: headers}
    );
  }

  spotifyCall = (method: any, url: any, body: any, token: any, callback: any) =>{
    let headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    })
    let xhr = new XMLHttpRequest();
    xhr.open = method, url;
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    xhr.send(body);
    //xhr.onload(callback);
  }

  GetPlaylists(id: string, token: string) {
    let headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    })
    const url: string = 'https://api.spotify.com/v1/users/'+ id + '/playlists?offset=0&limit=20';

    return this.http.get(
      url,
      {headers: headers}
    );
  }

} 
  
  


