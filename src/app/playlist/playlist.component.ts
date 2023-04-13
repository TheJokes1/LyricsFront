import { AfterViewInit, Component, OnDestroy, OnInit, Output } from '@angular/core';
import { ApiService} from '../services/api.service';
import { DataService } from '../services/data.service';
import { Buffer } from 'buffer';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { bindCallback } from 'rxjs';
import { Router } from '@angular/router';
import { PrettyjsonPipe } from '../prettyjson.pipe';
import { Playlist } from '../Shared/Playlist';
const PLAYLISTS = "https://api.spotify.com/v1/me/playlists";

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss'],
})
export class PlaylistComponent implements OnInit {
  url: string;
  spotifyUrl: string = `https://accounts.spotify.com/`;
  //redirect_uri = "http://localhost:4200/Playlist";
  redirect_uri = "https://thejokes1.github.io/LyricsFront/Playlist";
  client_id= "4c51f7e54bd546e7a04d4141ff59ce8f";
  aToken: any = "";
  playlists: Array<{ name: string, url: string, id: string, img: string }> = [];
  userId : any;
  chosenPlaylist: Playlist = {name:'', url:'', id:'', img:''};
  //tracks: Array<{artist: string, title: string}> = [];
  tracks: any;
  rToken: any;


  constructor(private apiService: ApiService, private http: HttpClient, private router: Router, private dataService: DataService) { }
  
  accessSpotifyLogic(){
    //console.log(localStorage.getItem('access_token'), 
    //localStorage.getItem('refresh_token'),
    //localStorage.getItem('spotify_userId'));
    if (localStorage.getItem('access_token') != undefined && 
        localStorage.getItem('refresh_token') != undefined &&
        localStorage.getItem('spotify_userId') != undefined){
          this.userId= localStorage.getItem('spotify_userId');
          this.getPlaylists(this.userId!,
            localStorage.getItem('access_token')!);
          } else {
            console.log("local storage NOT OK");
            this.requestAuthorization();
         }
  }

  ngOnInit(): void {
    this.onPageLoad();
  }

  onPageLoad(){
    if (window.location.search.length > 0) {
      this.handleRedirect();
    }
  }

  handleRedirect(){
    var code = this.getCode(); 
    window.history.pushState("", "", this.redirect_uri);
    this.fetchAccessToken(code!);
  }

  getCode(){
    let code = null;
    const queryString = window.location.search; // the code spotify sends back in the URL
    if ( queryString.length > 0 ){
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code')
    }
    return code;
  }

  fetchAccessToken(code: string){ //with the code provided in URL redirect
    // this.callAuthorizationApi(code).subscribe({
      this.apiService.GetAccessTokenWithCode(code).subscribe({
        next: (response: any) => {
        if (response.accessToken.length > 0){
          localStorage.setItem("access_token", response.accessToken);
          this.aToken = response.access_token;
        }
        if (response.refreshToken != undefined){
          localStorage.setItem("refresh_token", response.refreshToken);
        }
        this.getUserId();
      },
      error: (err: any) => {
        console.log(err.headers);
      }
    });
  }

  getUserId() {
    this.aToken = localStorage.getItem('access_token');
    this.apiService.getSpotifyUserId(this.aToken).subscribe({
      next: (response: any) => {
        console.log("User: ", response);
        this.userId = response.id;
        localStorage.setItem("spotify_userId", this.userId);
        this.getPlaylists(this.userId, this.aToken);
      },
      error: (err) => { 
      console.log('getuserid error: ', err);
    }
  });
}


getPlaylists(id: string, token: string){
  this.apiService.GetPlaylists(id, token).subscribe({
    next: (response: any) => {
      console.log("playlists reponse: ", response);
      for (let index = 0; index < response.items.length; index++){
        if (this.userId == response.items[index].owner.id 
            && response.items[index].images.length>0 ){
              const obj = {name : response.items[index].name, 
              id : response.items[index].id,
              url: response.items[index].tracks.href, 
              img: response.items[index].images[0].url}
              this.playlists.push(obj);
            // this.apiService.getTest().pipe(map((data: any) => { data.Data = data.Data.map((item: any) => 
            //   ({ projectName: item['Project Name'], projectCode: item.PCode }); return data; })
          }
        }
        console.log("PLAYLISTS: ", this.playlists);
      },
      error: (err) => {
        console.log(err);
        if (err.status == 401) console.log ("we need to refresh");
        this.useRefreshToken();
      }
  });
}
  
  useRefreshToken(){
    this.rToken = localStorage.getItem('refresh_token');
    this.userId = localStorage.getItem('spotify_userId');
    this.apiService.GetRefreshToken(this.rToken).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response.access_token.length > 0){
          localStorage.setItem("access_token", response.access_token);
          this.aToken = response.access_token;
        }
        this.getUserId();
      },
      error: (error: any )=> {
        console.log(error);
      }
    });
  }
  
  accessPlaylist(value: any){
    this.dataService.chosenPlaylist.url = value.url;
    this.dataService.chosenPlaylist.name = value.name;
    this.dataService.chosenPlaylist.img = value.img;
    this.dataService.chosenPlaylist.id = value.id;
    this.getPlaylistTracks(this.dataService.chosenPlaylist.url);
  }

  requestAuthorization(){
    this.url = this.spotifyUrl;
    this.url += "authorize";
    this.url += "?client_id=" + this.client_id;
    this.url += "&response_type=code";
    this.url += "&redirect_uri=" + encodeURI(this.redirect_uri);
    this.url += "&show_dialog=true";
    //this.url += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
    this.url += "&scope=user-read-playback-position user-library-read playlist-read-private playlist-read-collaborative";
    // change to playlist-read-collaborative   if wanted so
    window.location.href = this.url;
  }

//   getPlaylistTracks(url: any){
//     this.apiService.getPlaylistTracks(url, localStorage.getItem('access_token')!).subscribe({
//       next: (response: any) => {
//         console.log(response);
//         for (let index = 0; index < response.items.length; index++){
//           const obj = { artist : response.items[index].track.artists[0].name, 
//            title: response.items[index].track.name} ;
//           this.dataService.tracksPlaylist.push(obj);
//         }
//       },
//       error: (err) => {
//         console.log(err);
//       },
//       complete: () => {
//         console.log('Complete mapping songs', this.dataService.tracksPlaylist);
//         this.router.navigateByUrl('Playlist/Songs');
//         // MAKE THE CALL FOR PLAYLISTSONGCOMpONENT
//       }
//   });
// }

getPlaylistTracks(url: any){
  this.apiService.getPlaylistTracks(url, localStorage.getItem('access_token')!).subscribe({
    next: (tracks) => {
      this.tracks = tracks;
    },
    error: (error: any) => {
      console.log(error);
    },
    complete: () => {
      this.dataService.tracksPlaylist = this.tracks;
      this.router.navigateByUrl('Playlist/Songs');
    }
  });
}



}
