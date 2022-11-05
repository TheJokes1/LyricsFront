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
    // this.textAdd= "It takes time writing good lyrics. So does loading good apps...";
    // this.text="";
    // box.focus();
    

    // for (var i = 0, l = this.text.length; i < l; i++) {
    //   setTimeout(() => {
    //       this.text = this.text + this.text.substring(0, i + 1);
    //   }, i * 200);
    // }
  }  

}


