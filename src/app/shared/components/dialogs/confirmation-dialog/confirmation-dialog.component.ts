import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Tables } from 'src/app/shared/entities/tables';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css'],
})
export class ConfirmationDialogComponent implements OnInit {

  @Input() tab: Tables = new Tables();
  
  constructor(private dialog: MatDialogRef<any>) {}

  ngOnInit(): void {}

  onNo() {
    this.dialog.close(false);
  }

  onYes() {
    this.dialog.close(true);
  }
}
