import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DiaologHostComponent } from 'src/app/shared/components/dialogs/dialog-host/dialog-host';
import { Tables } from 'src/app/shared/entities/tables';
import { FormFieldConfig } from '../../../dropdown/form_field_config';

@Component({
  selector: 'app-linkbutton',
  templateUrl: './linkbutton.component.html',
  styleUrls: ['./linkbutton.component.css'],
})
export class LinkbuttonComponent implements OnInit {
  tab: any = new Tables();
  @Input() config: FormFieldConfig;
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      this.config = changes['config'].currentValue;
    }
  }

  planifierUneTache() {
    this.tab.dialogName = 'scheduler';
    this.tab.config = this.config;

    let dialogRef = this.dialog.open(DiaologHostComponent, {
      panelClass: 'filtre-dialog-component',
      data: {
        title: 'Planification de la tâche: ' + this.config.elementdata.nom,
        msg: `Voulez-vous vraiment planifier cette tâche`,
        tab: this.tab,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Do something if the result is true
      }
    });
  }
}
