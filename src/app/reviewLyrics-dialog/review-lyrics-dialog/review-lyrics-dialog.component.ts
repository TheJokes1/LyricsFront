import { Component, Output, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-review-lyrics-dialog',
  templateUrl: './review-lyrics-dialog.component.html',
  styleUrls: ['./review-lyrics-dialog.component.css']
})


export class ReviewLyricsDialogComponent implements OnInit {
  dialogLyrics?: string;
  songTitle?: string;
  performerName? : string;

  constructor(public dialogRef: MatDialogRef<ReviewLyricsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}


  ngOnInit(): void {
    this.dialogLyrics = this.data.lyrics;
    this.songTitle = this.data.songTitle;
    this.performerName = this.data.performerName;
    console.log(this.dialogLyrics);
  }

}
