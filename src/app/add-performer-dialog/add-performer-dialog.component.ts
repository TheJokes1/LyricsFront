import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-performer-dialog',
  templateUrl: './add-performer-dialog.component.html',
  styleUrls: ['./add-performer-dialog.component.css']
})
export class AddPerformerDialogComponent implements OnInit {
  performerName: string;

  constructor(public dialogRef: MatDialogRef<AddPerformerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}


  ngOnInit(): void {
    this.performerName= this.data.performerName;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
