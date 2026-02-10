import { HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import { DashboardComponent } from 'src/app/admin/core/components/dashboard/dashboard.component';
import { HttpclientService } from 'src/app/admin/core/services/httpclientService';
import { UtilService } from 'src/app/admin/core/services/utilService';
import { AddresseDto } from '../../entities/adresse-dto';
import { Civilite } from '../../entities/civilite';
import { CodepostalDto } from '../../entities/codepostal-dto';
import { Email } from '../../entities/email';
import { EmailDto } from '../../entities/email-dto';
import { Entite } from '../../entities/entite';
import { Faxe } from '../../entities/faxe';
import { Fonction } from '../../entities/fonction';
import { Personnemorale } from '../../entities/personnemorale';
import { Personnephysique } from '../../entities/personnephysique';
import { Tables } from '../../entities/tables';
import { Tel } from '../../entities/tel';
import { Type } from '../../entities/type';
import { VilleDto } from '../../entities/ville-dto';
import { AlertService } from '../../services/alert-service';
import { DiaologHostComponent } from '../dialogs/dialog-host/dialog-host';

@Component({
  selector: 'app-champs',
  templateUrl: './champs.component.html',
  styleUrls: ['./champs.component.css'],
})
export class ChampsComponent implements OnInit {
  personnephysique: Personnephysique = new Personnephysique();
  personnemorales: Personnemorale[] = [];
  personnemoralesDefaut: Personnemorale[] = [];
  personneDefault: Personnephysique = new Personnephysique();
  civilite: Civilite = new Civilite();
  tel: Tel = new Tel();

  noteprivee: string;
  notepublique: string;

  //test liste d'entités
  entites: Entite[] = [];

  civilites: Observable<Civilite[]>;
  types: Observable<Type[]>;
  fonctions: Observable<Fonction[]>;
  fonction: Fonction = new Fonction();
  showdepartement: boolean = false;
  departments: any[];
  personnemorale: Personnemorale = new Personnemorale();
  columns: string[] = ['Nom fournisseur', 'Code fournisseur'];
  columnsdefaut: string[] = ['Nom fournisseur'];

  adresseligne: string;
  codepostal: any;
  ville: string;
  addressedto: AddresseDto = new AddresseDto();
  villedto: VilleDto = new VilleDto();
  codepostaldto: CodepostalDto = new CodepostalDto();
  clientResult$: Observable<any>;
  villeList: any[];
  /** mode d'affichage  */

  @Input() public value: string;
  @Input() public tab: Tables = new Tables();
  edition: boolean = false;
  lecture: boolean = false;
  // table: Tables = new Tables();

  constructor(
    private httplClientService: HttpclientService,
    private dialog: MatDialog,
    private dash: DashboardComponent,
    private utilService: UtilService,
    private alertService: AlertService,
    private httpClientService: HttpclientService
  ) {}

  ngOnInit(): void {
    this.civilites = this.httplClientService.getList<Civilite>(
      'assets/mock-apis/civilites.json'
    );
    this.types = this.httplClientService.getList<Type>(
      'assets/mock-apis/typepersonnes.json'
    );
    this.fonctions = this.httplClientService.getList<Fonction>(
      'assets/mock-apis/fonctions.json'
    );
    if (this.tab.value === 'edition') {
      this.edition = true;
      this.personnephysique.tels.push(new Tel());
      this.personnephysique.emails.push(new Email());
      this.personnephysique.faxes.push(new Faxe());
    } else if (this.tab.value === 'lecture') {
      this.httplClientService
        .getObjet(this.tab.entite, this.tab.id)
        .subscribe((res) => {
          /** intitialisation des données  */
          this.tel.libelle = 'Télephone portable';
          this.personnephysique = res;
          this.personnephysique.tels.push(this.tel);
          this.fonction = this.personnephysique.fonction;
          this.personnemorale.nom = this.personnephysique.tier;
          this.personnemoralesDefaut.push(this.personnemorale);
          
          this.personneDefault = res;
          this.httplClientService
            .getTableDataList('personnemorale')
            .subscribe((result) => {
              this.personnemorales = result;
              this.personnephysique.personnemorales = result.filter(
                (rs) => rs.nom === this.personnephysique.tier
              );
              /*if(!this.personnephysique.personnemorales && this.personnephysique.tier!=''){
            let morale = new Personnemorale();
            morale.nom = this.personnephysique.tier;
            
          }*/
            });
        
          
          Object.entries(this.personnephysique.notes).filter(([k, v]) => {
            switch (k) {
              case '':
                this.noteprivee = v;
                break;
              case '':
                this.notepublique = v;
                break;
            }
          });
          this.civilite = this.personnephysique.civilite;
          this.addressedto = this.personnephysique.addresses[0];
          this.codepostal = this.addressedto.codepostal;
          this.villedto = this.addressedto.ville;
          this.adresseligne = this.addressedto.adresseligne[0];
          this.codepostal = this.utilService
            .formatNumberToInteger(this.villedto.codepostal.valeur)
            .replace(',', '');
          this.ville = this.villedto.nom;
        });
      this.lecture = true;
      
    }
    this.clientResult$ = this.httpClientService.getFromclient().pipe(
      map((res) => {
        this.villeList = res.villes;
        this.departments = res.departements;
        return res.formcontent['CONTACT-CLIENT'];
      })
    );
  }

  ajoutTel() {
    this.personnephysique.tels.push(new Tel());
  }
  retirerTel(val: any) {
    this.personnephysique.tels.splice(val, 1);
  }

  ajoutFaxe() {
    this.personnephysique.faxes.push(new Faxe());
  }
  retirerFaxe(val: any) {
    this.personnephysique.faxes.splice(val, 1);
  }

  modeEdition() {
    this.edition = true;
    this.lecture = false;
  }

  rafraichir() {
    this.personnephysique = this.personneDefault;
    
    
    //alert("ok")
  }

  annuler() {
    this.lecture = true;
    this.edition = false;
    this.personnephysique = this.personneDefault;
  }

  supprimer() {
    let dialogRef = this.dialog.open(DiaologHostComponent, {
      panelClass: 'filtre-dialog-component',
      width: '500px',
      data: '',
    });
  }

  ouvrirFournisseur(valeur: any) {
    this.dash.visualisation(valeur.nom, 'personnemorale', valeur.id);
  }
  enregistrer() {
    /** on recupere les données  */
    this.villedto.nom = this.ville;
    this.personnephysique.civilite = this.civilite;
    this.codepostaldto.valeur = this.codepostal;
    this.addressedto.adresseligne.push(this.adresseligne);
    this.villedto.codepostal = this.codepostaldto;
    this.addressedto.ville = this.villedto;
    this.personnephysique.addresses = [];
    this.personnephysique.addresses.push(this.addressedto);
    this.httpClientService
      .post(this.personnephysique, `${this.tab.entite}/add`)
      .subscribe((data) => {
        this.personnephysique = data;
        if (data.status === '200') {
          this.alertService.confirmDialog({
            title: '',
            message: `l'enregistrement de ${this.tab.entite} a réussit`,
            confirmText: 'Yes',
            cancelText: 'No',
          });
          this.edition = false;
          this.lecture = true;
        } else {
          this.alertService.confirmDialog({
            title: '',
            message: `l'enregistrement de ${this.tab.entite} a échoué`,
            confirmText: 'Yes',
            cancelText: 'No',
          });
        }
        setTimeout(() => {
          this.alertService.closeAlert();
        }, 1500);
      });
  }

  changeDepartment($event: any) {
    this.showdepartement = false;
    this.personnephysique.nompays = '';
    this.personnephysique.departement = '';

    if ($event.value !== 'other') {
      let pays = this.departments.filter((res) => res.titre === $event.value);
      this.personnephysique.nompays = pays[0].perenom;
    }

    if ($event.value === 'other') {
      this.showdepartement = true;
    }
  }
  /*ngOnDestroy(): void {
    throw new Error('Method not implemented.');
    
  }*/
}
