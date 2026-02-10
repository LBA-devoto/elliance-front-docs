import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CatalogueMenuDialogComponent } from '../catalogue-menu-dialog/catalogue-menu-dialog.component';
import { Personnemorale } from 'src/app/shared/entities/personnemorale';

@Component({
  selector: 'app-catalogue-menu-resp',
  templateUrl: './catalogue-menu-resp.component.html',
  styleUrls: ['./catalogue-menu-resp.component.css']
})
export class CatalogueMenuRespComponent implements OnInit {
  selectable = true;
  removable = true;
  addOnBlur = true;

  @Input()
  filtres: string[] = [];
  @Input()
  vueFournisseur: boolean = false;
  @Input()
  extranetFournisseur: boolean = false;
  @Input()
  fournisseur?: Personnemorale;

  @Output()
  filterOut: EventEmitter<string[]> = new EventEmitter()

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }
  
  remove(value: any) {
    const index = this.filtres.indexOf(value);
    if (index >= 0) {
      this.filtres.splice(index, 1);
      this.filterOut.emit(this.filtres)
    }
  }
  openFilter() {
    this.dialog.open(CatalogueMenuDialogComponent, {data: {filtre: this.filtres, vueFournisseur: this.vueFournisseur, extranetFournisseur: this.extranetFournisseur}, width:'80vw'}).afterClosed().subscribe((res) => {
      if (res) {
        this.filtres = res;
        this.filterOut.emit(this.filtres);
      }
    });
  }

  resetFilter() {
    this.filtres = [];
    localStorage.removeItem('filter');
    this.filterOut.emit(this.filtres)
  }

}
