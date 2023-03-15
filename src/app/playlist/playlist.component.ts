import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Buffer } from 'buffer';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { bindCallback } from 'rxjs';

import { PrettyjsonPipe } from '../prettyjson.pipe';

const PLAYLISTS = "https://api.spotify.com/v1/me/playlists";

interface playlistParameters{
  name: string;
  url: string;
  id: string;
}

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss'],
})
export class PlaylistComponent implements OnInit, AfterViewInit {
  geconnecteerd: string = "";
  url: string;
  client_id = "4c51f7e54bd546e7a04d4141ff59ce8f";
  client_secret = "ed88fa0c5b4b480c92fc6ca3f982d617";
  spotifyUrl: string = `https://accounts.spotify.com/`;
  redirect_uri = "http://localhost:4200/Playlist";
  aToken: any = "";
  playlists: Array<{ name: string, url: string, id: string, img: string }> = [];

  constructor(private apiService: ApiService, private http: HttpClient) { }
  
  ngAfterViewInit(): void { 
    console.log(this.geconnecteerd);
  }

  ngOnInit(): void {
    console.log('OnInit');
    this.onPageLoad();
  }

  onPageLoad(){
    if (window.location.search.length > 0) {
      this.handleRedirect();
    }
  }

  handleRedirect(){
    var code = this.getCode();
    this.fetchAccessToken(code!);
    
    //window.history.pushState("", "", this.redirect_uri);
  }

  getCode(){
    let code = null;
    const queryString = window.location.search;
    if ( queryString.length > 0 ){
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code')
    }
    return code;
  }

  fetchAccessToken(code: string){
    let body = this.spotifyUrl + "api/token?";
    body += "grant_type=authorization_code";
    body += "&code=" + code; 
    body += "&redirect_uri=" + encodeURI(this.redirect_uri);
    //body += "&client_id=" + this.client_id;
    //body += "&client_secret=" + this.client_secret;
    this.callAuthorizationApi(code).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response.access_token.length > 0){
          localStorage.setItem("access_token", response.access_token);
          this.aToken = response.access_token;
        }
        if (response.refresh_token != undefined){
          localStorage.setItem("refresh_token", response.refresh_token);
        }
        this.getUserId(response.access_token);
        this.geconnecteerd = "next";
      },
      error: (err) => {
        console.log(err.headers);
        this.geconnecteerd= "error";
      }
    });
  }

  getUserId(access_token: any) {
    window.history.pushState("", "", this.redirect_uri); //clean the URL (remove the spotify api code)
    this.apiService.getSpotifyUserId(access_token).subscribe({
      next: (response: any) => {
        this.getPlaylist(response.id);
      },
      error: (err) => {
      console.log('getuserid err: ', err);
      }
    });
    //this.apiService.spotifyCall("GET", PLAYLISTS, null, access_token, this.handleResponse );
    
  }

  getPlaylist(id: string){
    this.apiService.GetPlaylists(id, this.aToken).subscribe({
      next: (response: any) => {
        console.log(response);
        for (let index = 0; index < response.items.length; index++){
          const obj = {name : response.items[index].name, id : response.items[index].id,
            url: response.items[index].tracks.href, img: response.items[index].images[0].url}
          this.playlists.push(obj);
        }
        console.log("PLAYLISTS: ", this.playlists);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  accessPlaylist(value: any){
    console.log("liiiiiist: ", value);
    this.getPlaylistTracks(value.url);
  }

  getPlaylistTracks(url: any){
    this.apiService.GetPlaylistTracks(url, this.aToken).subscribe({
      next: (response: any) => {
        console.log("TRAAACKS: ", response);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  handleResponse(){
    console.log("handled");
  }

  callAuthorizationApi(code: any){
    let httpParams = new HttpParams()
    .append("grant_type", "authorization_code")
    .append("code", code)
    .append("redirect_uri", this.redirect_uri);
    let headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' //+ Buffer.from(this.client_id + ":" + this.client_secret, 'base64')  //code.toString('base64').
                              + btoa(this.client_id + ":" + this.client_secret)
    });

    return this.http.post("https://accounts.spotify.com/api/token", httpParams.toString(),
      
      { headers: headers }
    );
  }
  

  requestAuthorization(){
    this.url = this.spotifyUrl;
    this.url += "authorize";
    this.url += "?client_id=" + this.client_id;
    this.url += "&response_type=code";
    this.url += "&redirect_uri=" + encodeURI(this.redirect_uri);
    this.url += "&show_dialog=true";
    this.url += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";

    window.location.href = this.url;
    this.geconnecteerd = "Connectedd";
  }

}
