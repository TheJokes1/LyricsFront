import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent implements OnInit {
  loadingDisabled : boolean = false;

  constructor(private apiService: ApiService) { 
    console.log("calling now", this.loadingDisabled);
    this.apiService.GetRandomQuote().subscribe((response: any) => {
      console.log(response);
      this.loadingDisabled = true;
    });
  }


  ngOnInit(): void {
  }

}



