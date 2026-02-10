import {
  Component,
  OnInit,
  Input,
  ViewChild,
  SimpleChanges,
  OnDestroy,
  Inject,
} from '@angular/core';
import { CheckboxRequiredValidator } from '@angular/forms';
import { EntityService } from 'src/app/admin/core/services/entity.service';
import { EntiteDirective } from '../../../directives/entite.directives';
import { EntiteChamp } from '../../../entities/champ/entitechamp';
import { Subscription } from 'rxjs';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { DialogComponent } from '../dialog.component';
import { DiaologHostComponent } from '../dialog-host/dialog-host';
import { ViewDto } from 'src/app/shared/entities/viewdto';
import { ViewService } from 'src/app/admin/core/services/viewservice';
import { Tables } from 'src/app/shared/entities/tables';
import { TableComponent } from '../../dynamic-component-shared/table/table.component';
import { TabService } from 'src/app/shared/services/tab.service';

@Component({
  selector: 'app-visualisation',
  templateUrl: './visualisation.component.html',
  styleUrls: ['./visualisation.component.css'],
})
export class VisualisationComponent implements OnInit, OnDestroy {
  @Input() tab: Tables = new Tables();
  @ViewChild(EntiteDirective, { static: true })
  entiteDirective: EntiteDirective;
  entiteChamps: EntiteChamp[] = [];
  nouveauxChamps: EntiteChamp[] = [];
  subscriptions: Subscription[] = [];
  selectedOption: boolean = false;
  viewdto: ViewDto = new ViewDto();

  get invalidForm() {
    return !this.viewdto.nom || this.nouveauxChamps.length == 0;
  }

  constructor(
    private entiteService: EntityService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<DiaologHostComponent>,
    private viewSercice: ViewService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private myTableService: TabService
  ) {}

  ngOnInit(): void {
    this.selectedOption = this.viewdto.shared;

    this.getChamps(this.tab.entite);
    this.dialogRef.updateSize(undefined, '90%');
  }
  
  ngOnDestroy() {
    this.subscriptions.forEach((element) => {
      element.unsubscribe();
    });
  }
  async getChamps(entite: string) {
    try {
      const result = await this.entiteService.recouperChampsdEntite(entite);

      const resultCopy = JSON.parse(JSON.stringify(result));
      this.entiteChamps = resultCopy;

      if (this.tab.view !== undefined) {
        this.viewdto = this.tab.view;
        this.selectedOption = this.viewdto.shared;
        const nouveauxChampsArr = Object.values(this.viewdto.champs);

        if (nouveauxChampsArr !== undefined) {
          nouveauxChampsArr.forEach((x) => {
            this.ajouterauVisusation(x);
          });
        }
      } else {
        this.viewdto = new ViewDto();
        this.viewdto.nom = '';
      }
    } catch (error) {
      console.error('Error getting entity fields:', error);
    }
  }


  ajouterauVisusation(cham: string) {
    // console.log(this.entiteChamps);
    if (this.entiteChamps) {
      let sele = this.entiteChamps?.find((x) => x.nom === cham);
      let dejaAjouter = this.nouveauxChamps?.find((x) => x.nom === cham);
      if (sele && !dejaAjouter) {
        this.nouveauxChamps?.push(sele);
      }
      this.entiteChamps = this.entiteChamps?.filter((x) => x.nom !== cham);
    }
  }

  drop(event: CdkDragDrop<any[]>) {
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

  ouvrirFiltrePredefinis() {
    this.tab.dialogName = 'filterpredefini';
    this.tab.view = this.viewdto;

    let dialogRef = this.dialog.open(DiaologHostComponent, {
      panelClass: 'filtre-dialog-component',
      data: {
        title: 'Filtres prédéfinis',
        msg: ``,
        dialogName: 'filterpredefini',
        tab: this.tab,
        nouveauxChamps: this.nouveauxChamps,
        filterTypes: this.tab.filterTypes,
      },
    });

    dialogRef.afterClosed().subscribe((response: any) => {
      // Si response == undefined, c'est que l'utilisateur a cliqué sur retour ou sur la croix pour fermer la popup
      if (response || response === null) {
        // si response == null, c'est que l'utilisateur souhaite effacer tous les filtres
        this.enregistrer();
      }
    });
  }

  enregistrer() {
    this.viewdto.champs = new Map();
    this.nouveauxChamps.forEach((obj, index) => {
      this.viewdto.champs.set(index, obj.nom);
    });
    this.viewdto.champs = Object.fromEntries(this.viewdto.champs);
    this.viewdto.labels = this.loadLabels();
    this.viewdto.ownerid = localStorage.getItem('userid');
    this.viewdto.type = this.tab.title;
    this.viewdto.entite = this.tab.entite;
    this.viewdto.shared = this.selectedOption;

    let url = '/view/add';
    this.entiteService.enregistrerView(this.viewdto, url).subscribe((res) => {
      this.viewSercice.updateView(res);
    });

    this.dialogRef.close(this.viewdto);
  }

  loadLabels() {
    let champsArray = Object.values(this.viewdto.champs);
    let labels = new Map();
    champsArray.forEach((obj: any, index: number) => {
      let lab = this.nouveauxChamps.find((el) => el?.nom == obj)?.label.fr_FR;
      labels.set(index, lab);
    });
    labels = Object.fromEntries(labels);
    return labels;
  }

  annuler() {
    this.dialog.closeAll();
  }
}
