import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpclientService } from 'src/app/admin/core/services/httpclientService';
import { ViewService } from 'src/app/admin/core/services/viewservice';
import { Tables } from 'src/app/shared/entities/tables';

@Component({
  selector: 'app-filtrer-champ',
  templateUrl: './filtrer-champ.component.html',
  styleUrls: ['./filtrer-champ.component.css'],
})
export class FiltrerChampComponent implements OnInit, OnDestroy {
  @Input()
  public tab: Tables = new Tables();

  private typeCondition: string;

  private choixConditionsParType: { [key: string]: any[] };
  //   TEXT: [
  //     { label: 'Contient', value: 'CONTAINS' },
  //     { label: 'Ne contient pas', value: 'NOT_CONTAINS' },
  //     { label: 'Est égale à', value: 'EQUALS' },
  //     { label: 'Est différent de', value: 'NOT_EQUALS' },
  //     { label: 'Commence par', value: 'STARTS_WITH' },
  //     { label: 'Fini par', value: 'ENDS_WITH' },
  //     { label: 'Est vide', value: 'IS_EMPTY' },
  //     { label: "N'est pas vide", value: 'IS_NOT_EMPTY' },
  //   ],
  //   NUMBER: [
  //     { label: 'Est égale à', value: 'EQUALS' },
  //     { label: 'Est différent de', value: 'NOT_EQUALS' },
  //     { label: 'Est inferieur à', value: 'LESS_THAN' },
  //     { label: 'Est inferieur ou égal à', value: 'LESS_THAN_OR_EQUALS' },
  //     { label: 'Est supérieur à', value: 'GREATER_THAN' },
  //     { label: 'Est supérieur ou égal à', value: 'GREATER_THAN_OR_EQUALS' },
  //     { label: 'Est compris entre (min - max)', value: 'BETWEEN' },
  //     { label: 'Est vide', value: 'IS_EMPTY' },
  //     { label: "N'est pas vide", value: 'IS_NOT_EMPTY' },
  //   ],
  //   DATE: [
  //     { label: 'Est égale à', value: 'EQUALS' },
  //     { label: 'Est différent de', value: 'NOT_EQUALS' },
  //     { label: 'Est inferieur à', value: 'LESS_THAN' },
  //     { label: 'Est inferieur ou égal à', value: 'LESS_THAN_OR_EQUALS' },
  //     { label: 'Est supérieur à', value: 'GREATER_THAN' },
  //     { label: 'Est supérieur ou égal à', value: 'GREATER_THAN_OR_EQUALS' },
  //     { label: 'Est compris entre (min - max)', value: 'BETWEEN' },
  //     { label: 'Est vide', value: 'IS_EMPTY' },
  //     { label: "N'est pas vide", value: 'IS_NOT_EMPTY' },
  //   ],
  //   UNKNOWN: [
  //     { label: 'Contient', value: 'CONTAINS' },
  //     { label: 'Ne contient pas', value: 'NOT_CONTAINS' },
  //     { label: 'Est égale à', value: 'EQUALS' },
  //     { label: 'Est différent de', value: 'NOT_EQUALS' },
  //     { label: 'Commence par', value: 'STARTS_WITH' },
  //     { label: 'Fini par', value: 'ENDS_WITH' },
  //     { label: 'Est vide', value: 'IS_EMPTY' },
  //     { label: "N'est pas vide", value: 'IS_NOT_EMPTY' },
  //   ],
  // };

  public choixConditions: any[];

  public conditions: any[] = [];

  public peuxEffacerRecherche: boolean = false;

  public parameters: string[] = [];

  public isParameterField: boolean = false;

  constructor(
    private dialog: MatDialogRef<any>,
    private viewService: ViewService,
    private httpclientService: HttpclientService
  ) {}

  public ngOnInit(): void {
    this.choixConditionsParType = this.viewService.filterConditions();
    this.typeCondition = this.tab.champType;

    this.choixConditions = this.choixConditionsParType[this.typeCondition];

    if (this.tab.filter === undefined || this.tab.filter === null) {
      //on defini contient comme condition par defaut grâce l'index 0
      const conditionDefaut = this.choixConditions[0];
      this.conditions.push({
        id: this.conditions.length,
        type: this.typeCondition,
        condition: conditionDefaut.value,
        valeur: '',
        valeurMin: '',
        valeurMax: '',
      });
    } else {
      for (let condition of this.tab.filter.conditions) {
        this.conditions.push({
          id: this.conditions.length,
          type: condition.type,
          condition: condition.condition,
          valeur: condition.valeur,
          valeurMin: condition.valeurMin,
          valeurMax: condition.valeurMax,
        });
      }
      this.peuxEffacerRecherche = true;
    }


    this.httpclientService
      .get(`view/references/${this.tab.entite}/${this.tab.champ}`)
      .subscribe((references) => {
        if (references !== null && references.length > 0) {
          this.isParameterField = true;

          this.parameters = references
            .filter((reference: any) => reference['valeur'] !== undefined)
            .map((reference: any) => reference['valeur']);

          if (this.tab.filter === undefined || this.tab.filter === null) {
            this.conditions.pop();
            this.conditions.push({
              id: this.conditions.length,
              type: this.typeCondition,
              condition: 'EQUALS',
              valeur: this.parameters[0],
              valeurMin: '',
              valeurMax: '',
            });
          }
        } else {
          this.isParameterField = false;
        }
      });
  }

  public ngOnDestroy(): void {}

  public fermer(): void {
    this.dialog.close();
  }

  public ajouterCondition(): void {
    this.conditions.push({
      id: this.conditions.length,
      type: this.typeCondition,
      condition: '',
      valeur: '',
      valeurMin: '',
      valeurMax: '',
    });
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
  isDateParameter(parameter: string): boolean {
    // Add logic to check if the parameter is a date
    return true; // Modify this based on your conditions
  }

  public rechercher(): void {
    if (this.conditions.length > 0) {
      this.dialog.close({
        champ: this.tab.champ === 'téléphone' ? 'tels' : this.tab.champ,
        conditions: this.conditions,
        defaultValue: false,
      });
    } else {
      this.dialog.close(null);
    }
  }

  public effacerRecherche(): void {
    this.dialog.close(null);
  }

  public boutonrechercherdesactive(): boolean {
    if (this.conditions.length > 0) {
      for (const condition of this.conditions) {
        if (condition.condition === '') {
          return true;
        }
        if (condition.condition === 'BETWEEN') {
          if (condition.valeurMin === '' || condition.valeurMax === '') {
            return true;
          }
        }
        if (
          condition.condition !== 'BETWEEN' &&
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
}
