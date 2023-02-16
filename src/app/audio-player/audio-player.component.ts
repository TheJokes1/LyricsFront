import { AfterViewInit, Component, ElementRef, Input, ViewChild, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.css']
})
export class AudioPlayerComponent implements AfterViewInit {
  @Input() public src: string;
  @Input() public autoplay: boolean = false;
  //@Input() public showStateLabel: boolean = false;
  public audioStateLabel = 'Audio sample';
  @Input() public volume: number = 1.0; 
  @ViewChild('audioElement', { static: false }) public _audioRef:  ElementRef;
  private audio: HTMLMediaElement;
  previewTime: number;
  timeOut: number;

  public constructor(private renderer : Renderer2) {
    //this.src = 'https://p.scdn.co/mp3-preview/17dc74947c15bfaf6ea9bbb83489fb07eac57c27?cid=4c51f7e54bd546e7a04d4141ff59ce8f%22';
    this.previewTime = parseInt(JSON.parse(localStorage.getItem('previewDuration') || '2')) * 1000;
    //this.timeOut = this.previewTime
    //this.previewTime = JSON.parse(localStorage.getItem('previewDuration') || 'false');

    this.renderer.listen('document', 'click', (event) => {
      if (event.target.id == "preview"){
        console.log('preview clicked.');
      this.play();
      }
    })
  }

  public pause(): void {
    if (this.audio) {
      this.audio.pause();
      this.audioStateLabel = 'Paused';
    }
  }

  public get paused(): boolean {
    if (this.audio) {
      return this.audio.paused;
    } else {
      return true;
    }
  }

  public play(): void {
    if (this.audio) {
      if (this.audio.readyState >= 2) {
        this.audio.play();
        this.audioStateLabel = 'Playing...'
        setTimeout(() => {
          this.stop();
        }, this.previewTime);
      }
    }
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  ngOnInit(){
    // this._audioRef.nativeElement.onended = () => {
    //   this._audioRef.nativeElement.pause();
    // }
  }

  getAudioElement() {
    return this._audioRef.nativeElement;
  }

  public ngAfterViewInit() {
    this.audio = this._audioRef.nativeElement;
    if (this.audio) {
      this.audio.volume = this.volume;
      this.audio.autoplay = this.autoplay;
    }
  }
}