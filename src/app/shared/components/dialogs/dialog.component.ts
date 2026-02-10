import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogData } from './dialog-data';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
})
export class DialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData,
              private dialogRef: MatDialogRef<DialogComponent>,) {}

  ngOnInit(): void {}


  cancel(){
    this.dialogRef.close();
  }

  confirmer(){
    this.dialogRef.close(true)
  }

}
