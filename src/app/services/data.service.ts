import { Injectable } from '@angular/core';
import { Playlist } from '../Shared/Playlist';
import { Track } from '../Shared/Track';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  public chosenPlaylist: Playlist = {name:'', url:'', id:'', img:''};

  public tracksPlaylist: Track[] = [];
}
