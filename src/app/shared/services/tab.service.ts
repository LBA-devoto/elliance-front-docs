import { EventEmitter, Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Table } from '../entities/Table';
import { Tables } from '../entities/tables';
import { ViewDto } from '../entities/viewdto';
import { Language } from '../entities/language';

@Injectable({
  providedIn: 'root',
})
export class TabService {
  public dataSourceSubject = new BehaviorSubject<{
    [entitteName: string]: MatTableDataSource<any>;
  }>({});
  defaultTab: Tables = new Tables();
  public datasourceUpdated: EventEmitter<any> = new EventEmitter();
  private deleteSubject = new Subject<number>();
  private updateDataSubject = new Subject<number>();
  private updatedashboardSubject = new Subject<{ tabId: any; data: any }>();
  private updateTemplateSubject = new Subject<{ tabId: any; data: any }>();
  selectedValue: any;
  // private updateTemplateSubject = new Subject<any>();

  get deleteEvent(): Observable<number> {
    return this.deleteSubject.asObservable();
  }

  get updateDataEvent(): Observable<number> {
    return this.updateDataSubject.asObservable();
  }

  // get updateTemplateEvent(): Observable<any> {
  //   return this.updateTemplateSubject.asObservable();
  // }
  public tabs: Tables[] = [];

  constructor() {
    this.defaultTab.entite = 'accueil';
    this.defaultTab.title = 'Accueil';
    this.tabs.push(this.defaultTab);
  }

  get updateTemplateEvent(): Observable<{ tabId: any; data: any }> {
    return this.updateTemplateSubject.asObservable();
  }

  setDataSource(entiteName: string, value: MatTableDataSource<any>): void {
    const currentDataSource = this.dataSourceSubject.value;
    currentDataSource[entiteName] = value;
    this.dataSourceSubject.next(currentDataSource);
  }

  getDataSource(entiteName: string): MatTableDataSource<any> {
    return this.dataSourceSubject.value[entiteName];
  }

  deleteListItems(itemIds: string[], key: string, totalElements: number) {
    const currentData = this.dataSourceSubject.value[key].data;
    const newData = currentData.filter((item) => !itemIds.includes(item.id));
    this.dataSourceSubject.value[key].data = newData;
    let newTotalElements = totalElements - itemIds.length;
    this.deleteSubject.next(newTotalElements);
  }
  updateOrAddItem(item: any, key: string): void {
    const dataSourceValue = this.dataSourceSubject.value;
    if (
      !dataSourceValue ||
      !dataSourceValue[key] ||
      !dataSourceValue[key].data
    ) {
      return;
    }

    const currentData = dataSourceValue[key]?.data;
    const index = currentData.findIndex((x) => x?.id === item?.id);

    if (index === -1) {
      // Add the item as the first element in the array
      currentData.unshift(item);
    } else {
      currentData[index] = item;
    }

    dataSourceValue[key].data = currentData;
    let newTotalElements = currentData.length;
    this.updateDataSubject.next(newTotalElements);
  }

  // updateTemplateData(data: any): void {
  //   // Emit a new object instead of updating the same reference
  //   this.updateTemplateSubject.next(Object.assign({}, data));
  // }
  updateTemplateData(tabId: any, data: any): void {
    // Emit a new object with tabId and data properties
    this.updateTemplateSubject.next({ tabId, data });
  }

  getTabTitle(obj: any, languages: Language[], entite: any): any | undefined {
    if (languages && languages.length > 0) {
      this.selectedValue = languages
        .filter((language) => language.selected === true)
        .map((language) => language.key);
    }

    if (
      entite.toLocaleLowerCase() === 'produit' || entite.toLocaleLowerCase() === 'produitarchive' ||
      entite.toLocaleLowerCase() === 'categorie'
    ) {
      return obj['code'];
    } 
    else if (entite.toLocaleLowerCase() === 'catalog') {
      
      return obj['title'];
    } 
    else if (entite === 'variablelogistique') {
      return obj['mapDescriptionVl'][this.selectedValue[0]];
    } else if (entite.toLocaleLowerCase() === 'picto') {
      if (this.selectedValue[0]) {
        return obj['label'][this.selectedValue[0]];
      } else return obj['label'].fr_FR;
    } else if (entite.toLocaleLowerCase() === 'pictocatalogue') {
      return obj['famille'];
    } else if (entite.toLocaleLowerCase() === 'parametre') {
      return obj['valeur'];
    } else if(entite.toLocaleLowerCase() === 'adaptationplaque') 
    {
      return obj['produit']?.code + "-" +  obj['plaque']?.code
    }
    else if (
      entite.toLocaleLowerCase() === 'role' ||
      entite.toLocaleLowerCase() === 'user'
    ) {
      return obj['nom'];
    }
  }
}
