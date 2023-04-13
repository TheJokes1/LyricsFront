import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpParams } from '@angular/common/http';
import { buffer, map, Observable, tap } from 'rxjs';
import { Performer } from '../second-page/second-page.component'; 
import { HttpHeaders } from '@angular/common/http';
import { Lyric } from '../Shared/Lyric';
import { Track, TrackData } from '../Shared/Track';
import { DataService } from './data.service';


@Injectable({
  providedIn: 'root'
})

@Injectable()
export class ApiService {

  //baseUrl: string = `https://localhost:5001/api/`;
  baseUrl: string = `https://lyricslover.azurewebsites.net/api/`;
  limit: number= 50;
  baseUrlMM: string = 'https://api.musixmatch.com/ws/1.1/';
  baseUrlSpot: string = `https://localhost:5001/api/spot/`
  private tracks: Track[] = [];

  constructor(private http: HttpClient, private dataService: DataService) {
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

  GetAccessToken(code: any){ // Backend API does the call to Spotify
    return this.http.post( 
      this.baseUrl + `spot?` + code,
      {observe: 'response'}
    )
  }

  GetAccessTokenWithCode(code: any){
    const url = `${this.baseUrl}Spot/${code}`;
    return this.http.post(url, { observe: 'response' });
  }

  GetRefreshToken(token: string){
    const url = `${this.baseUrl}spot/refresh_token`;
    const body = { refresh_token: token };
    return this.http.post(url, body);
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
    const url: string = 'https://api.spotify.com/v1/users/'+ id + '/playlists?offset=0&limit='+this.limit;

    return this.http.get(
      url,
      {headers: headers}
    );
  }

  getPlaylistTracks(link: string, token: string){
    let headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    })

    return this.http.get(
      link,
      {headers: headers}
    )
    .pipe(
      map((response: any) => {
        //console.log(response);
        let counter = 1;
        const tracks: TrackData[] = [];
        response.items.forEach((item: any) => {
          if (item.track.artists[0].name.length > 0) {
            const track: TrackData = {
              artist: item.track.artists[0].name,
              title: item.track.name
            };
            if (track.artist != undefined){
              //console.log(`${counter}. ${track.artist} - ${track.title}`); // log track with number
              tracks.push(track);
              counter++;
            }

          }
        });
        console.log("in api: ", tracks);
        return tracks;
      }),
      // tap((data: TrackData[]) => {
      //   const tracks: Track[] = data.map((trackData: TrackData) => ({
      //     artist: trackData.artist,
      //     title: trackData.title
      //   }));
        //this.dataService.tracksPlaylist = tracks;
      //})
    )
  }

  getLyricsFromMM(token: string, artist: string, title: string){
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    });
    const urlMM: string = this.baseUrlMM + 'matcher.lyrics.get?q_track=' + title +'&q_artist=' 
      + artist 
      + '&apikey=' + token;

    return this.http.get( 
      urlMM,
      { headers: headers }
      )
  }

  GetMMTrackLyrics = (title: string, artist: string) => {
    return this.http.get(
      this.baseUrl + `Spot` + `?title=${title}` + `&artist=${artist}`
    );
  }

} 
  
  


