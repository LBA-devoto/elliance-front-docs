import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-remove',
  templateUrl: './confirm-remove.component.html',
  styleUrls: ['./confirm-remove.component.css']
})
export class ConfirmRemoveComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: string[], private dialogRef: MatDialogRef<ConfirmRemoveComponent>) { }

  ngOnInit(): void {
    this.dialogRef.updateSize('500px')
  }

  send(resp: 'OK'|'CANCEL'|'CLOSE') {
    this.dialogRef.close(resp);
  }

}
