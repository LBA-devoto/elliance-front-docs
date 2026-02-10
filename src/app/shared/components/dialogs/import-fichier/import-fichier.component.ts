import {
  Component,
  OnInit,
  Input,
  OnDestroy,
} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Tables } from 'src/app/shared/entities/tables';
import { ViewService } from 'src/app/admin/core/services/viewservice';

@Component({
  selector: 'app-import-fichier',
  templateUrl: './import-fichier.component.html',
  styleUrls: ['./import-fichier.component.css'],
})
export class ImportFichierComponent implements OnInit, OnDestroy {

  @Input() tab: Tables = new Tables();

  file: File | null = null;

  types: any[] = [
    { label: 'CSV', value: 'csv' },
    { label: 'XLS', value: 'xls' },
    { label: 'XLSX', value: 'xlsx' }
  ];
  selectedType: string = 'csv';

  records: any[] | null = null;
  nbIgnored: number = 0;
  nbSuccess: number = 0;
  nbWarnings: number = 0;
  nbErrors: number = 0;
  nbTotal: number = 0;

  views: any[] = [];
  selectedView: string = '';

  inProgress: boolean = false;

  constructor(
    private httpClient: HttpClient,
    private dialog: MatDialog,
    private viewService: ViewService) {}

  public ngOnInit(): void {
    this.viewService.getViews(this.tab.title, this.tab.entite).map(view => this.views.push({ label: view.nom, value: view.id }));
  }

  public ngOnDestroy(): void {

  }

  public exportertramefichier(): void {
    const url: string = (this.selectedView !== undefined && this.selectedView !== null && this.selectedView !== '')
      ? `/entite/export/trame/view/${this.selectedView}/${this.selectedType}`
      : `/entite/export/trame/${this.tab.entite}/${this.selectedType}`

    this.httpClient.post<Blob>(url, this.tab.locales, { responseType: 'blob' as 'json' }).subscribe((data: Blob) => {
      const blob = new Blob([data], this.selectedType === 'csv' ? {type: 'application/csv'} : {type: 'application/vnd.ms-excel'});  
      
      const objectUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = `export.${this.selectedType}`;
      link.click();
        
      URL.revokeObjectURL(objectUrl);
    });
  }

  public importerfichier($event: any): void {
    this.file = $event.target.files[0];
  }

  public telechargerRapport(): void {
    if (this.records !== null) {
      let text = '';

      text += `Nombre de lignes traitées = ${this.nbTotal}\n`;
      text += `Nombre de lignes ignorées = ${this.nbIgnored}\n`;
      text += `Nombre de lignes validées = ${this.nbSuccess}\n`;
      text += `Nombre de lignes avec alerte = ${this.nbWarnings}\n`;
      text += `Nombre de lignes en erreur = ${this.nbErrors}\n\n`;

      for (const record of this.records) {
        if (record.type === 'IGNORED') {
          text += `${record.row} : IGNORE\n`
        } else if (record.type === 'WARNING') {
         text += `ALERTE [LIGNE ${record.row} - COLONNE ${record.column}] ${record.message}\n`;
        } else if (record.type === 'ERROR' && record.column !== undefined && record.column !== null && record.column !== '') {
          text += `ERREUR [LIGNE ${record.row} - COLONNE ${record.column}] ${record.message}\n`;
        } else if (record.type === 'ERROR' && (record.column === undefined || record.column === null || record.column === '')) {
          text += `ERREUR [LIGNE ${record.row}] ${record.message}\n`;
        }
      }

      const link = document.createElement('a');
      link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(text);
      link.download = 'rapport.txt';
      link.click();
    }
  }

  public fermer(): void {
    this.dialog.closeAll();
  }

  public enregistrer(): void {
    if (this.file !== null) {
      const formData: FormData = new FormData();
      formData.append('file', this.file, this.file.name);

      // Augmenter la limite de taille de fichier à 50 Mo
      const options: any = {};
      options.headers = new HttpHeaders();
      options.headers.set('Content-Type', 'multipart/form-data');
      options.headers.set('Accept', 'application/json');
      options.headers.set('Access-Control-Allow-Origin', '*');
      options.reportProgress = true;

      this.inProgress = true;

      this.httpClient.post(`/entite/import/${this.tab.entite}`, formData, options).subscribe((report: any) => {  
        if (report !== undefined || report !== null) {
          const records: any[] = report.records;
          for (let i = 0; i < records.length; i++) {
            const record: any = records[i];
            if (record.type === 'IGNORED') {
              this.nbIgnored++;
            } else if (record.type === 'SUCCESS') {
              this.nbSuccess++;
            } else if (record.type === 'WARNING') {
              this.nbWarnings++;
            } else if (record.type === 'ERROR') {
              this.nbErrors++;
            }
            this.nbTotal++;
          }
          this.records = records;
        } else {
          this.records = null;
        }
      }, (error: any) => console.log(error)); // we are going to write a logging service later to handle errors
    }
  }
}
