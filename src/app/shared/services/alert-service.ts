import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { ConfirmDialogData } from '../components/dialogs/dialog-data';
import { DialogComponent } from '../components/dialogs/dialog.component';

export enum AlertType {
  SUCCESS = 'success',
  WARNING = 'warning',
  DANGER = 'danger',
  WHITE = 'white',
}

export class Alert {
  type: AlertType;
  message: string;
  constructor(type: AlertType, message: string) {
    this.type = type;
    this.message = message;
  }
}

@Injectable()
export class AlertService {

  alertDuration = 5000;
  constructor(private dialog: MatDialog) { }

  confirmDialog(data: ConfirmDialogData): Observable<boolean> {
    return this.dialog
      .open(DialogComponent, {
        data,
        width: '400px',
        disableClose: true,
      })
      .afterClosed();
  }

  closeAlert() {
    this.dialog.closeAll();
  }
}
