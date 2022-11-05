import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})

export class LandingPageComponent implements AfterViewInit {
@ViewChild("Writing") writing : ElementRef;
text: string = "It takes time writing good lyrics. So does loading good apps...";
textAdd: string  = ""

  constructor(public el: ElementRef) { 
  }

  ngAfterViewInit(): void {
    //var box = this.writing.nativeElement;
    // box.focus();

    // for (var i = 0, l = this.text.length; i < l; i++) {
    //   setTimeout(() => {
    //       this.textAdd = this.textAdd + this.text.substring(0, i + 1);
    //   }, 1000);
    //   console.log("text: ",this.textAdd);
    //   console.log("I am: ",i);
    // }
  }  

}


