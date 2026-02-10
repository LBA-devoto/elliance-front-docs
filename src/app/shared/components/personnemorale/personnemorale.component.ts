import { SelectionModel } from '@angular/cdk/collections';
import { TmplAstBoundAttribute } from '@angular/compiler';
import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  ViewChild,
  OnDestroy,
  Inject,
  LOCALE_ID,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { map, Observable, Subscription } from 'rxjs';
import { DashboardComponent } from 'src/app/admin/core/components/dashboard/dashboard.component';
import { HttpclientService } from 'src/app/admin/core/services/httpclientService';
import { UtilService } from 'src/app/admin/core/services/utilService';
import { AddresseDto } from '../../entities/adresse-dto';
import { CodepostalDto } from '../../entities/codepostal-dto';
import { DepartementDto } from '../../entities/departementdto';
import { Email } from '../../entities/email';
import { EmailDto } from '../../entities/email-dto';
import { Faxe } from '../../entities/faxe';
import { Logistique2, Personnemorale } from '../../entities/personnemorale';
import { Personnephysique } from '../../entities/personnephysique';
import { Tables } from '../../entities/tables';
import { Tel } from '../../entities/tel';
import { TelDto } from '../../entities/tel-dto';
import { Type } from '../../entities/type';
import { VilleDto } from '../../entities/ville-dto';
import { MenuActions } from '../../enums/menu-actions';
import { PageOptions } from '../../enums/page-modes';
import { PersonnemoraleStatuts } from '../../enums/personemoral-statut-types';
import { AlertService } from '../../services/alert-service';
import { DialogComponent } from '../dialogs/dialog.component';

@Component({
  selector: 'app-personnemorale',
  templateUrl: './personnemorale.component.html',
  styleUrls: ['./personnemorale.component.css'],
})
export class PersonMoraleComponent implements OnInit, OnDestroy {
  public pageOptions = PageOptions;
  public pageOption = PageOptions.WAIT;
  @Input() public tab: Tables = new Tables();
  @Input() public value: string;
  @ViewChild('personphysique', { static: false })
  personPhysiquePaginator: MatPaginator;
  @ViewChild('personmorale', { static: false })
  personMoralePaginator: MatPaginator;
  departement: string;
  subscription: Subscription;
  edition: boolean = false;
  lecture: boolean = false;
  activerAttribution: boolean = false;
  /********* selectionModel pour la liste des checkbox selectionner ****/
  selection = new SelectionModel<Personnephysique>(true, []);
  selectionner = new SelectionModel<Personnephysique>(true, []);
  clickSelection = new Set<any>();

  selectionPhotographe = new SelectionModel<Personnephysique>(true, []);
  selected = new FormControl();
  select = new FormControl();
  listedechamps: ['select', 'code', 'raisonsociale', 'codefour', 'nompays'];
  personphysiqueList: Personnephysique[] = [];
  table: Tables = new Tables();
  displayedColumns: string[] = ['nom', 'prenom', 'statut'];
  personnemorale: Personnemorale = new Personnemorale();
  adresseligne: string;
  adresse: AddresseDto = new AddresseDto();
  codepostaldto: CodepostalDto = new CodepostalDto();
  datasource = new MatTableDataSource<any>();
  datasourceClient = new MatTableDataSource<any>();
  villeDto: VilleDto = new VilleDto();
  personMoralStatusTypes = PersonnemoraleStatuts;
  status: string[] = [];
  statut: string[] = ['Oui', 'Non'];
  pesonMoralSubscript: Subscription;
  message: any;
  contractClientOptions: string[] = [];

  villeList: any[];
  departments: any[];

  PersonPhysiqueSubscript: Subscription;
  subscriptions: Subscription[] = [];
  clientResult$: Observable<any>;
  codePostal!: any;

  departmentList: any[];
  departementDto: DepartementDto = new DepartementDto();

  constructor(
    private httpClientService: HttpclientService,
    private dash: DashboardComponent,
    private utilService: UtilService,
    private alertService: AlertService,
    private dialog: MatDialog
  ) {
    this.status = Object.keys(this.personMoralStatusTypes);
  }

  ngOnInit(): void {
    if (this.tab.value === 'edition') {
      this.edition = true;
      this.personnemorale.tels.push(new TelDto());
      this.personnemorale.emails.push(new Email());
      this.personnemorale.faxes.push(new Faxe());
      this.personnemorale.type = new Type();
      this.personnemorale.logistique = new Logistique2();
      this.personnemorale.type.nom = this.tab.type;
    } else if (this.tab.value === 'lecture') {
      this.tab.listedechamps = this.listedechamps;

      let subs = this.httpClientService
        .getObjet(this.tab.entite, this.tab.id)
        .subscribe((res) => {
          this.personnemorale = res;
          this.codepostaldto =
            this.personnemorale.addresses[0].ville.codepostal;
          this.codepostaldto.valeur = this.utilService
            .formatNumberToInteger(this.codepostaldto.valeur)
            .replace(',', '');
          this.personnemorale.capital = this.utilService
            .formatNumberToInteger(this.personnemorale.capital)
            .replace(',', ' ');

          this.villeDto = this.personnemorale.addresses[0].ville;
          this.adresseligne = this.personnemorale.addresses[0].adresseligne[0];
        });
      this.subscriptions.push(subs);
      // this code should be changed to return a list of details of associated person morale

      this.httpClientService
        .getList<Personnephysique>(
          `personnemorale/code/${this.personnemorale.code}`
        )
        .subscribe((data) => {
          this.datasource.data.push(data);

          this.datasourceClient.paginator = this.personMoralePaginator;

          //
        });
      // this.httpClientService.personMoraleMapData(Personnemorale.m)

      //get the person pysyique

      this.lecture = true;

      // this.table.listedechamps = this.listedechamps
      // this.table.entite = "personnephysique"
      // this.table.id = "636a5c1cd17093616082751a"
      // this.table.isdetail =  true;
    }

    this.clientResult$ = this.httpClientService.getFromclient().pipe(
      map((res) => {
        this.villeList = res.villes;
        this.departments = res.departements;
        return res.formcontent['CONTACT-CLIENT'];
      })
    );
  }

  enregistrer() {
    this.personnemorale.typeid = '635b95c6b96fd53d382b5d3c';
    this.personnemorale.statut = '635be8fe48e3e006e717b9f2';
    this.personnemorale.code = '123456789112';

    //
    let sub = this.httpClientService
      .post(this.personnemorale, `${this.tab.entite}/add`)
      .subscribe((data) => {
        this.personnemorale = data.body;
        if (data.status == '200') {
          this.edition = false;
          this.lecture = true;
          this.alertService.confirmDialog({
            title: '',
            message:
              (this.message = `l'enregistrement de ${this.tab.entite} a réussit`),
            confirmText: 'Yes',
            cancelText: 'No',
          });
        } else {
          this.alertService.confirmDialog({
            title: '',
            message:
              (this.message = `l'enregistrement de ${this.tab.entite} a échoué`),
            confirmText: 'Yes',
            cancelText: 'No',
          });
        }
        setTimeout(() => {
          this.alertService.closeAlert();
        }, 1500);
      });
    this.subscriptions.push(sub);
  }
  annuler() {}
  supprimer() {
    let dialogRef = this.dialog.open(DialogComponent, {
      panelClass: 'filtre-dialog-component',
      width: '500px',
      data: {
        title: 'Confirmation de la suppression',
        msg: `Voulez-vous vraiment supprimer l'enregistrement pour ${this.personnemorale.nom}`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        let id = this.personnemorale.id;
        let url = `${this.tab.entite}/delete/${id}`;
        let sub = this.httpClientService
          .get<Personnemorale>(url)
          .subscribe((res) => {
            if (res.status == '200') {
              this.edition = false;
              this.lecture = true;
              this.alertService.confirmDialog({
                title: '',
                message:
                  (this.message = `le supression de ${this.tab.entite} a réussit`),
                confirmText: 'Yes',
                cancelText: 'No',
              });
            } else {
              this.alertService.confirmDialog({
                title: '',
                message:
                  (this.message = `le supression de ${this.tab.entite} a échoué`),
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

  modeEdition() {
    this.edition = true;
    this.lecture = false;
  }

  ngOnchanges(changes: SimpleChanges) {
    if (changes['value']) {
      this.value = changes['value'].currentValue;
    }
  }
  retirerEmail(val: any) {
    this.personnemorale.emails.splice(val, 1);
  }
  ajoutTel() {
    const tel = new TelDto();
    this.personnemorale.tels.push(tel);
  }
  retirerTel(val: any) {
    this.personnemorale.tels.splice(val, 1);
  }

  ajoutEmail() {
    const email = new EmailDto();
    this.personnemorale.emails.push(email);
  }

  rafraichir() {
    this.personnemorale = new Personnemorale();
  }
  /**
   * polymophically process the user menu actions
   * @param useraction
   */
  processUserAction(useraction: MenuActions) {
    switch (useraction) {
      case MenuActions.REFRESH:
        this.rafraichir();
        break;
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.datasource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.datasource.data);
  }

  checkboxLabel(element?: any): string {
    if (!element) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(element) ? 'deselect' : 'select'} row ${
      element.id + 1
    }`;
  }
  ngOnDestroy() {
    this.subscriptions.forEach((element) => {
      element.unsubscribe();
    });
  }

  ngAfterViewInit() {
    this.datasource.data = this.personnemorale.personnephysiques;
    this.datasource.paginator = this.personPhysiquePaginator;
    this.datasourceClient.data = this.personnemorale.personnemorales;
    this.datasourceClient.paginator = this.personMoralePaginator;
  }

  ouvrirpersonMorale(valeur: any) {
    this.dash.visualisation(valeur.nom, 'personnemorale', valeur.id);
  }

  ouvrirpersonPhysique(valeur: any) {
    this.dash.visualisation(valeur.nom, 'personnephysique', valeur.id);
  }

  changeVille(ville: any) {
    this.villeList.filter((v) => {
      if (v.nom === ville) {
        this.villeDto = v;
        this.villeDto.codepostal = v.codepostal;
      }
    });
  }
  selectionChange($event: any) {
    this.personnemorale.codepostal = '';

    if ($event.value) {
      let code = this.villeList.filter((res) => res.nom === $event.value);
      this.personnemorale.codepostal = code[0].codepostal.valeur;
    }
  }

  changeDepartment($event: any) {
    this.personnemorale.nompays = '';
    if ($event.value) {
      let pays = this.departments.filter((res) => res.titre === $event.value);
      this.personnemorale.nompays = pays[0].perenom;
    }
  }
}
