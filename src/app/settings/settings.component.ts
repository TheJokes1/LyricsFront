import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  checked: boolean;
  constructor() { }

  ngOnInit(): void {
    this.checked = JSON.parse(localStorage.getItem('checked') || 'false');
  }

  toggleIt(){
    this.checked = !this.checked;
    localStorage.setItem('checked', JSON.stringify(this.checked));
  } 

}
