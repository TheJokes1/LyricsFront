import { Injectable } from '@angular/core';
import { Playlist } from '../Shared/Playlist';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public chosenPlaylist: Playlist = {name:'', url:'', id:'', img:''};

  public tracksPlaylist: Array<{artist: '', title: ''}> = [];
}
