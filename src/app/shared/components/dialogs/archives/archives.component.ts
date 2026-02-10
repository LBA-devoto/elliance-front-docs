import { Component, Input, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { audit } from 'rxjs';

import { Tables } from 'src/app/shared/entities/tables';

@Component({
  selector: 'app-archives',
  templateUrl: './archives.component.html',
  styleUrls: ['./archives.component.css'],
})
export class ArchivesComponent implements OnInit {

  @Input() tab: Tables = new Tables();

  public fields: string[];

  public currentField: string;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    if (this.tab.auditLogs !== undefined && this.tab.auditLogs !== null) {
      this.fields = [...new Set(this.tab.auditLogs.map(auditLog => auditLog.fieldName))]
        .sort((a, b) => {
          if (a < b) { return -1; }
          if (a === b) { return 0; }
          return 1;
        });
      this.currentField = this.fields[0];
    }
  }

  onClose() {
    this.dialog.closeAll();
  }
}
