import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SplashScreenStateService } from '../services/splash-screen-state.service';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.css']
})

export class SplashComponent implements OnInit {
  public opacityChange = 1;
  public splashTransition :string;
  public showSplash = true;
  text: string = "It takes time writing good lyrics. So does loading good apps...";
  textAdd: string  = ""
  @ViewChild("Writing") writing : ElementRef;

  constructor(private splashScreenStateService: SplashScreenStateService, public el: ElementRef) { 
  }

  ngOnInit(): void {
    this.splashScreenStateService.subscribe((res: any) => {
      this.hideSplashAnimation(res);
    })
  }

  private hideSplashAnimation(res: any) {
    this.splashTransition = 'opacity ${this.ANIMATION_DURATION}s';
    this.opacityChange = 0;

    setTimeout(() => {
      this.showSplash = !this.showSplash;
    }, 1000);
  }
}
