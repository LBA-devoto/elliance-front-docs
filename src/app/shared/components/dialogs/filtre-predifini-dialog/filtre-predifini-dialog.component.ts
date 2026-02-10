import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpclientService } from 'src/app/admin/core/services/httpclientService';
import { ViewService } from 'src/app/admin/core/services/viewservice';
import { Tables } from 'src/app/shared/entities/tables';

@Component({
  selector: 'filterpredefini',
  templateUrl: './filtre-predifini-dialog.component.html',
  styleUrls: ['./filtre-predifini-dialog.component.css'],
})
export class FiltrePredifiniDialogComponent implements OnInit {
  @Input() tab: Tables;
  listdechamps: any[] = [];
  filter: any[] = [];
  nom: string = '';
  private typeCondition: string;
  champType: string;

  private choixConditionsParType: { [key: string]: any[] };

  public choixConditions: any[];

  public conditions: any[] = [];
  filters: { [key: string]: any } = {};
  filterTypes: any = null;

  public peuxEffacerRecherche: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialogRef<any>,
    private httpClient: HttpclientService,
    private viewService: ViewService
  ) { }

  ngOnInit(): void {
    this.loadConditions();
    this.loadChamps();

    this.filterTypes = this.tab.filterTypes;
    this.nom = this.tab.view.nom;
    this.fillConditions();
  }

  loadChamps() {
    let codes = this.data.nouveauxChamps.map((el: any) => el.nom);
    let labels = this.data.nouveauxChamps.map((el: any) => el.label.fr_FR);
    codes.forEach((cod: any, i: number) => {
      this.listdechamps.push({ code: cod, label: labels[i] })
    })
  }

  loadConditions() {
    this.choixConditionsParType = this.viewService.filterConditions();
  }

  public ajouterCondition(): void {
    this.conditions.push({
      id: this.conditions.length,
      type: this.typeCondition,
      condition: '',
      valeur: '',
      champ: '',
    });
  }

  fillConditions() {
    if (this.tab.view.filter === undefined || this.tab.view.filter === null || this.tab.view.filter.length === 0) {
      this.conditions.push({
        id: this.conditions.length,
        type: this.typeCondition,
        condition: '',
        valeur: '',
        champ: '',
      });
    } else {
      for (let filter of this.tab.view.filter) {
        this.conditions.push({
          id: this.conditions.length,
          type: filter.type,
          condition: filter.conditions[0].condition,
          valeur: filter.conditions[0].valeur,
          champ: filter.champ,
        });
        this.populerCondition(filter.champ);
      }

      this.peuxEffacerRecherche = true;
    }
  }

  populerCondition(code: any): void {
    this.champType = this.filterTypes[code.value];
    if (!this.champType) this.champType = 'UNKNOWN';

    this.choixConditions = this.choixConditionsParType[this.champType];
  }

  public supprimerCondition(id: number): void {
    const condition = this.conditions.find((t) => t.id === id);
    if (condition !== undefined) {
      this.conditions.splice(this.conditions.indexOf(condition), 1);
    }

    if (this.conditions.length === 0) {
      this.ajouterCondition();
    }
  }

  public rechercher(): void {
    if (this.conditions.length > 0) {
      this.filter = [];
      for (let condition of this.conditions) {
        this.filter.push({
          champ: condition.champ,
          conditions: [
            {
              condition: condition.condition,
              valeur: condition.valeur,
              type: condition.type,
            },
          ],
        });
      }

      this.tab.view.filter = this.filter;
      this.dialog.close(this.tab.view.filter);
    } else { 
      this.tab.view.filter = [];
      this.dialog.close(null);
    }
  }

  public effacerFiltres(): void {
    this.tab.view.filter = [];
    this.dialog.close(null);
  }

  public boutonrechercherdesactive(): boolean {
    if (this.conditions.length > 0) {
      for (const condition of this.conditions) {
        if (condition.condition === '') {
          return true;
        }
        if (
          condition.condition !== 'IS_EMPTY' &&
          condition.condition !== 'IS_NOT_EMPTY'
        ) {
          if (condition.valeur === '') {
            return true;
          }
        }
      }
    }
    return false;
  }

  public fermer(): void {
    this.dialog.close();
  }
}
