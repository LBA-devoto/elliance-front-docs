import {
  Component,
  OnInit,
  Input,
  OnDestroy,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Tables } from 'src/app/shared/entities/tables';

@Component({
  selector: 'app-export-fichier',
  templateUrl: './export-fichier.component.html',
  styleUrls: ['./export-fichier.component.css'],
})
export class ExportFichierComponent implements OnInit, OnDestroy {

  @Input() tab: Tables = new Tables();

  types: any[] = [
    { label: 'CSV', value: 'csv' },
    { label: 'XLS', value: 'xls' },
    { label: 'XLSX', value: 'xlsx' }
  ];
  selectedType: string = 'csv';

  inProgress: boolean = false;

  constructor(
    private httpClient: HttpClient,
    private dialog: MatDialog) {}

  public ngOnInit(): void {
    
  }

  public ngOnDestroy(): void {

  }

  public exporterfichier(): void {
    const url: string = (this.tab.view !== undefined && this.tab.view !== null)
      ? `/entite/export/view/${this.tab.view.id}/${this.selectedType}`
      : `/entite/export/${this.tab.entite}/${this.selectedType}`;

    this.inProgress = true;

    this.httpClient.post<Blob>(url, { filtres: Object.values(this.tab.filresappliques), ids: this.tab.ids, locales: this.tab.locales }, { responseType: 'blob' as 'json' }).subscribe((data: Blob) => {
      const blob = new Blob([data], this.selectedType === 'csv' ? {type: 'application/csv'} : {type: 'application/vnd.ms-excel'});  
      
      const objectUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = `export.${this.selectedType}`;
      link.click();
        
      URL.revokeObjectURL(objectUrl);

      this.fermer();
    });
  }

  public fermer(): void {
    this.dialog.closeAll();
  }
}
