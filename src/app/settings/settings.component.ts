import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  showArtist: boolean;
  showTitle: boolean;
  
  constructor() { }

  ngOnInit(): void {
    this.showArtist = JSON.parse(localStorage.getItem('showArtist') || 'false');
    this.showTitle = JSON.parse(localStorage.getItem('showTitle') || 'false');
  }

  toggleArtist(){
    this.showArtist = !this.showArtist;
    localStorage.setItem('showArtist', JSON.stringify(this.showArtist));
  } 

  toggleTitle(){
    this.showTitle = !this.showTitle;
    localStorage.setItem('showTitle', JSON.stringify(this.showTitle));
  }

}
