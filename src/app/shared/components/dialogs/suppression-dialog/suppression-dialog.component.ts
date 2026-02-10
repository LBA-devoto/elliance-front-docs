import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpclientService } from 'src/app/admin/core/services/httpclientService';
import { ViewService } from 'src/app/admin/core/services/viewservice';
import { DeleteReq } from 'src/app/shared/entities/deleteReq';
import { Tables } from 'src/app/shared/entities/tables';
import { TabService } from 'src/app/shared/services/tab.service';
import { TableComponent } from '../../dynamic-component-shared/table/table.component';

@Component({
  selector: 'app-suppression-dialog',
  templateUrl: './suppression-dialog.component.html',
  styleUrls: ['./suppression-dialog.component.css'],
})
export class SuppressionDialogComponent implements OnInit {
  @Input() tab: Tables = new Tables();
  selection = new SelectionModel<any>(true, []);
  deleteReq = new DeleteReq();
  constructor(
    private httpService: HttpclientService,
    private viewSercice: ViewService,
    private dialog: MatDialog,
    private myTableService: TabService
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tab']) {
      this.tab = changes['tab'].currentValue;
    }
  }

  annuler() {
    this.dialog.closeAll();
  }
  supprimme() {
    // this.deleteReq.idList = this.tableComponent.selection.map((cont) => {
    //   return cont.id;
    // });
    var entiteName = this.tab.entite;
    if (this.tab.entite === 'vl_logistique') {
      entiteName = 'variableLogistique';
    }
 
    this.httpService
      .post(this.tab.deleteReq, entiteName + '/bulkDelete')
      .subscribe((res) => {
        if (res) {
          this.dialog.closeAll();
          if (this.tab.entite !== 'view') {
            this.myTableService.deleteListItems(
              this.tab.deleteReq.idList,
              this.tab.entite,
              this.tab.totalElements
            );
          } else {
            this.viewSercice.deleteListItems(this.tab.deleteReq.idList);
          }

          return true;
        } else return false;
      });
  }
}
