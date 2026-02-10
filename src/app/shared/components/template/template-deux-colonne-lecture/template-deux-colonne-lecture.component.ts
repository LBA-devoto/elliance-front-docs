import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { DashboardComponent } from 'src/app/admin/core/components/dashboard/dashboard.component';
import { HttpclientService } from 'src/app/admin/core/services/httpclientService';
import { TemplateService } from 'src/app/services/template.service';
import { Tables } from 'src/app/shared/entities/tables';
import { Template } from 'src/app/shared/entities/template';
import { AlertService } from 'src/app/shared/services/alert-service';
import { DialogComponent } from '../../dialogs/dialog.component';
import { Subscription } from 'rxjs';
import { Parametre } from 'src/app/shared/entities/parametre';
import { v4 as uuidv4 } from 'uuid';
import { Layout } from '../../../entities/layout';
import { Row } from '../../../entities/row';
import { Col } from '../../../entities/col';
import { SousParametre } from 'src/app/shared/entities/sous-parametre';
import { Language } from 'src/app/shared/entities/language';
import { IdmlService } from 'src/app/shared/services/idml.service';

@Component({
  selector: 'app-template-deux-colonne-lecture',
  templateUrl: './template-deux-colonne-lecture.component.html',
  styleUrls: ['./template-deux-colonne-lecture.component.css'],
})
export class TemplateDeuxColonneLectureComponent implements OnInit, OnChanges {
  @Input() public value: string;
  @Input() public tab: Tables = new Tables();

  edition: boolean;
  lecture: boolean;

  subscriptions: Subscription[] = [];
  message: any;

  @Input() public template: Template = new Template();
  @Output() sendTemplate: EventEmitter<Template> = new EventEmitter<Template>();

  layout: Layout;

  parameters: Parametre[];

  parametersConnection: string[];

  isEditMode: boolean = false;

  isOpenLanguages: boolean = false;

  languages: Language[] = [
    { key: 'fr_FR', label: 'Français', selected: true },
    { key: 'en_GB', label: 'Anglais', selected: false },
    { key: 'de_DE', label: 'Allemand', selected: false },
    { key: 'es_ES', label: 'Espagnol', selected: false },
    { key: 'all', label: 'Toutes les langues', selected: false },
  ];

  constructor(
    private httpclientService: HttpclientService,
    private templateService: TemplateService,
    private dash: DashboardComponent,
    private alertService: AlertService,
    private dialog: MatDialog,
    private readonly _idmlService: IdmlService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['template'].firstChange) {
    }
  }

  ngOnInit(): void {
    //entite="personnemorale";
    //this.tab.id ="640517fd8372bf291638e156";
  }

  modeEdition() {
    this.sendTemplate.emit(this.template);
  }

  supprimer() {
    let dialogRef = this.dialog.open(DialogComponent, {
      panelClass: 'filtre-dialog-component',
      width: '600px',

      data: {
        title: 'Confirmation de la suppression',
        message: `Êtes-vous sûr de vouloir effectuer cette opération`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        let id = this.tab.id;
        var entiteName = this.template.entite.toLowerCase();
        if (this.tab.entite == 'variablelogistique') {
          entiteName = 'variableLogistique';
        }

        let url = `entite/${entiteName}/delete/${id}`;
        let sub = this.httpclientService.get<any>(url).subscribe((res) => {
          if (res.status == '200') {
            this.edition = false;
            this.lecture = true;
            this.alertService.confirmDialog({
              title: '',
              message:
                (this.message = `le supression de ${this.template.entite} a réussie`),
              confirmText: 'Yes',
              cancelText: 'No',
            });
          } else {
            this.alertService.confirmDialog({
              title: '',
              message:
                (this.message = `le supression de ${this.template.entite} a échoué`),
              confirmText: 'Yes',
              cancelText: 'No',
            });
          }
          setTimeout(() => {
            this.alertService.closeAlert();
          }, 1500);
        });
        this.subscriptions.push(sub);
        this.dash.openPrev(this.tab);
      }
    });
  }

  openClassLink(param: Parametre) {
    let id;
    let nom;
    param.parametres.map((item) => {
      if (item.label === 'id') {
        id = item.valeur;
      } else if (
        item.label === 'nom' ||
        item.label === 'titre' ||
        item.label === 'famille' ||
        item.label === 'code'
      ) {
        nom = item.valeur;
      }
    });
    //
    this.dash.visualisation(nom, param.entity, `${id}`);
  }

  openInterfaceLink(entity: string, param: SousParametre) {
    let id;
    let nom;
    param.parametres.map((item) => {
      if (item.label === 'id') {
        id = item.valeur;
      } else if (
        item.label === 'nom' ||
        item.label === 'titre' ||
        item.label === 'reference' ||
        item.label === 'code'
      ) {
        nom = item.valeur;
      }
    });
    //
    this.dash.visualisation(nom, entity, `${id}`);
  }

  openListLinkid(entity: string, id: string) {
    this.dash.visualisation(`${id}`, entity, `${id}`);
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // Layout editor
  //
  ////////////////////////////////////////////////////////////////////////////////////////////////////////

  editLayout() {
    if (this.template.layout === undefined || this.template.layout === null) {
      // For retrocompatibility
      this.layout = {
        hasCondition: false,
        conditions: [],
        tabs: [
          {
            id: uuidv4(),
            label: 'Informations générales',
            rows: [
              {
                id: uuidv4(),
                title: '',
                cols: [
                  {
                    id: uuidv4(),
                    title: '',
                    parameters: this.template.colonnegauche,
                  },
                  {
                    id: uuidv4(),
                    title: '',
                    parameters: this.template.colonnedroite,
                  },
                ],
              },
            ],
          },
        ],
      };
      this.parameters = [];
    } else {
      this.layout = this.template.layout;
      this.parameters = this.template.parameters;
      this.sortParameters();
    }
    this.refreshParametersConnection();

    this.isEditMode = true;
  }

  saveLayout() {
    this.template.layout = this.layout;
    this.template.parameters = this.parameters;

    this.updateLanguagesFilter();

    this.templateService
      .updateTemplate(this.template)
      .subscribe(() => (this.isEditMode = false));
  }

  cancelEditLayout() {
    this.isEditMode = false;
  }

  dropParameter(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  dropRows(event: CdkDragDrop<any>, rows: any) {
    moveItemInArray(rows, event.previousIndex, event.currentIndex);
  }

  dropCols(event: CdkDragDrop<any>, cols: any) {
    moveItemInArray(cols, event.previousIndex, event.currentIndex);
  }

  onAddCol(cols: any, colId: any) {
    const index: number = cols.findIndex((col: any) => col.id === colId);
    if (index !== -1) {
      cols.splice(index + 1, 0, { id: uuidv4(), title: '', parameters: [] });
    }
    this.refreshParametersConnection();
  }

  onRemoveCol(cols: any, colId: any) {
    const isLastCol = cols.length === 1;

    const index: number = cols.findIndex((col: any) => col.id === colId);
    if (index !== -1) {
      // Retrieve parameters from col selected
      cols[index].parameters.forEach((parameter: any) =>
        this.parameters.push(parameter)
      );
      this.sortParameters();

      // Remove col selected
      cols.splice(index, 1);
    }

    if (isLastCol) {
      cols.push({ id: uuidv4(), parameters: [] });
    }

    this.refreshParametersConnection();
  }

  onAddRow(rows: any, rowId: any) {
    const index: number = rows.findIndex((row: any) => row.id === rowId);
    if (index !== -1) {
      rows.splice(index + 1, 0, {
        id: uuidv4(),
        title: '',
        cols: [{ id: uuidv4(), title: '', parameters: [] }],
      });
    }
    this.refreshParametersConnection();
  }

  onRemoveRow(rows: any, rowId: any) {
    const isLastRow = rows.length === 1;

    const index: number = rows.findIndex((row: any) => row.id === rowId);
    if (index !== -1) {
      // Retrieve parameters from all cols from row selected
      rows[index].cols
        .flatMap((col: any) => col.parameters)
        .forEach((parameter: any) => this.parameters.push(parameter));
      this.sortParameters();

      // Remove row selected
      rows.splice(index, 1);
    }

    if (isLastRow) {
      rows.push({
        id: uuidv4(),
        title: '',
        cols: [{ id: uuidv4(), title: '', parameters: [] }],
      });
    }

    this.refreshParametersConnection();
  }

  onAddTab() {
    const index: number = this.layout.tabs.length;
    this.layout.tabs.push({
      id: uuidv4(),
      label: `Onglet ${index}`,
      rows: [
        {
          id: uuidv4(),
          title: '',
          cols: [{ id: uuidv4(), title: '', parameters: [] }],
        },
      ],
    });
    this.refreshParametersConnection();
  }

  onRemoveTab(index: number) {
    if (index > 0) {
      // Retrieve parameters from tab selected
      this.layout.tabs[index].rows
        .flatMap((row: any) => row.cols.flatMap((col: any) => col.parameters))
        .forEach((parameter: any) => this.parameters.push(parameter));
      this.sortParameters();

      // Remove tab selected
      this.layout.tabs.splice(index, 1);

      this.refreshParametersConnection();
    }
  }

  hasTitleOnRow(row: Row) {
    return row.title !== '';
  }

  hasTitleOnCols(cols: Col[]) {
    return (
      cols.filter((col: Col) => col.title != null && col.title.trim() !== '')
        .length > 0
    );
  }

  onSearch(event: KeyboardEvent) {
    const search: string = (<any>event.target).value.toLowerCase();

    this.parameters.sort((a: any, b: any) => {
      const aLabel = a.label.toLowerCase();
      const aName = a.name.toLowerCase();

      const bLabel = b.label.toLowerCase();
      const bName = b.name.toLowerCase();

      if (
        (aLabel.startsWith(search) && !bLabel.startsWith(search)) ||
        (aName.startsWith(search) && !bName.startsWith(search))
      ) {
        return -1;
      } else if (
        (!aLabel.startsWith(search) && bLabel.startsWith(search)) ||
        (!aName.startsWith(search) && bName.startsWith(search))
      ) {
        return 1;
      }

      return 0;
    });
  }

  private refreshParametersConnection() {
    this.parametersConnection = this.layout.tabs.flatMap((tab: any) =>
      tab.rows.flatMap((row: any) => row.cols.map((col: any) => col.id))
    );
    this.parametersConnection.push('parameters');
  }

  private sortParameters() {
    this.parameters.sort((a: Parametre, b: Parametre) => {
      const aStr = (a.label !== '' ? a.label : a.name).toLowerCase();
      const bStr = (b.label !== '' ? b.label : b.name).toLowerCase();

      if (aStr < bStr) {
        return -1;
      } else if (aStr > bStr) {
        return 1;
      }

      return 0;
    });
  }

  downloadPDF() {
    const locales: string[] = this.languages
      .filter((language) => language.selected)
      .map((language) => language.key);

    for (const locale of locales) {
      this.httpclientService
        .downloadBlob(`pdf/product/${this.tab.id}/${locale}`)
        .subscribe((data: Blob) => {
          const link: HTMLAnchorElement = document.createElement('a');
          link.href = window.URL.createObjectURL(data);
          link.download = `${this.tab.entite}-${this.tab.title}-${locale}.pdf`;
          link.click();
        });
    }
  }

  onOpenLanguages(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.isOpenLanguages = !this.isOpenLanguages;
  }

  @ViewChild('languagesElementRef') languagesElementRef: ElementRef;

  @HostListener('document:click', ['$event'])
  onCloseLanguages(event: any) {
    if (
      this.isOpenLanguages &&
      !this.languagesElementRef.nativeElement.contains(event.target)
    ) {
      this.isOpenLanguages = false;
      this.updateLanguagesFilter();
    }
  }

  onChangeLanguage(language: Language) {
    if (language.key === 'all') {
      this.languages.forEach((l) => (l.selected = language.selected));
    } else if (language.selected === false) {
      const allLanguages = this.languages.find((l) => l.key == 'all');
      if (allLanguages !== undefined) {
        allLanguages.selected = false;
      }
    } else if (language.selected === true) {
      if (
        this.languages.length -
        this.languages.filter((language) => language.selected).length ===
        1
      ) {
        const allLanguages = this.languages.find((l) => l.key == 'all');
        if (allLanguages !== undefined) {
          allLanguages.selected = true;
        }
      }
    }
    this.updateLanguagesFilter();
  }

  private updateLanguagesFilter() {
    const locales: string[] = this.languages
      .filter((language) => language.selected)
      .map((language) => language.key);

    if (this.template.layout === null) {
      [...this.template.colonnegauche, ...this.template.colonnedroite].forEach(
        (parametre) => {
          if (
            parametre.multiLangue !== undefined &&
            parametre.multiLangue === true
          ) {
            // Reset all
            parametre.parametres.forEach(
              (sousParameter) => (sousParameter.visible = false)
            );

            // Filter
            parametre.parametres.forEach((sousParameter) => {
              if (locales.indexOf('all') !== -1) {
                sousParameter.visible = true;
              } else if (locales.indexOf(sousParameter.label) !== -1) {
                sousParameter.visible = true;
              }
            });
          }
        }
      );
    } else {
      this.template.layout.tabs.forEach((tab) => {
        tab.rows.forEach((row) => {
          row.cols.forEach((col) => {
            col.parameters.forEach((parametre) => {
              if (
                parametre.multiLangue !== undefined &&
                parametre.multiLangue === true
              ) {
                // Reset all
                parametre.parametres.forEach(
                  (sousParameter) => (sousParameter.visible = false)
                );

                // Filter
                parametre.parametres.forEach((sousParameter) => {
                  if (locales.indexOf('all') !== -1) {
                    sousParameter.visible = true;
                  } else if (locales.indexOf(sousParameter.label) !== -1) {
                    sousParameter.visible = true;
                  }
                });
              }
            });
          });
        });
      });
    }
  }

  onExportIdml() {
    const locale: string = this.languages
      .filter((language) => language.selected)
      .map((language) => language.key)[0];

    this._idmlService.exportFile(this.tab.id, locale).subscribe((data: Blob) => {
      const link: HTMLAnchorElement = document.createElement('a');
      link.href = window.URL.createObjectURL(data);
      link.download = 'export.idml';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    });
  }
}
