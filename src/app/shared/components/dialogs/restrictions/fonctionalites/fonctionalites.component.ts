import { Component, Inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { map } from 'rxjs';
import { EntityService } from 'src/app/admin/core/services/entity.service';
import { HttpclientService } from 'src/app/admin/core/services/httpclientService';
import { NavOption } from 'src/app/user/navs/header-user/header-user.component';
import { environment } from 'src/environments/environment';
import {
  RestrictionEntite,
  RestrictionsComponent,
} from '../restrictions/restrictions.component';
import { Tables } from 'src/app/shared/entities/tables';
import { IDroit } from 'src/app/admin/core/interfaces/IDroit';
import { User } from 'src/app/shared/entities/authentication/user';
import { Role } from 'src/app/shared/enums/user-roles';

@Component({
  selector: 'app-fonctionalites',
  templateUrl: './fonctionalites.component.html',
  styleUrls: ['./fonctionalites.component.css'],
})
export class FonctionalitesComponent implements OnInit {
  menu: any = [];
  champs: any = [];
  fonctions: any = ['fournisseurOnly'];
  @Input() edition: boolean = false;
  lecture: boolean = true;

  droit: any = [];
  role: Role = new Role();

  users: User[] = [];
  motCle: string;
  roleusers: User[] = [];
  @Input() tab: Tables = new Tables();
  @Input() selectedmenu: any;
  public fonctionsback: any = [
    'Lecture/Affichage dans le menu',
    'Création',
    'Modification',
    'Suppression unitaire',
    'Modifier le template',
    'Génération de PDF',
    'Filtre dans le tableau de visualisation',
    'Suppression en masse',
    'Recherche par mots clés',
    'Import',
    'Export',
    'Visualisation de fiches en masse',
    'Création/Modification de visualisation',
    'Suppression de visualisation',
  ];
  entites: RestrictionEntite[] = [
    { entite: 'produit', label: 'Produit' },
    {
      entite: 'personnemorale',
      label: 'Personne morale (fournisseur, associé)',
    },
    { entite: 'actualite', label: 'Actualité' },
    { entite: 'personnephysique', label: 'Personne physique (contact)' },
    { entite: 'role', label: 'Rôle & profil' },
    { entite: 'categorie', label: 'Catégorie' },
  ];
  selectedEntity = this.entites[0];

  // get restrictions() {
  //   return this.data.restrict;
  // }

  // get user() {
  //   return this.data.user;
  // }

  // get back() {
  //   return this.data.back;
  // }

  constructor(
    private http: HttpclientService,
    private entiteService: EntityService,
    private httpClientService: HttpclientService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedmenu']) {
      this.selectedmenu = changes['selectedmenu'].currentValue;
    }
    if (changes['edition']) {
      this.edition = changes['edition'].currentValue;
    }
  }

  pickDroitItem() {}

  selectAll() {}
  ngOnInit(): void {
    this.loaddroits();
    // this.loadExistingResources();
    // if (this.tab.value === 'edition') {
    //   this.role = new Role();
    //   this.edition = true;
    //   this.lecture = false;
    //   let subs = this.httpClientService;
    // } else if (this.tab.value === 'lecture') {
    //   this.edition = false;
    //   this.lecture = true;
    //   let subs = this.httpClientService
    //     .getObjet(this.tab.entite, this.tab.id)
    //     .subscribe((res) => {
    //       this.role = res;
    //       this.droit = this.role.droits;
    //       if (this.role.menu.length === this.menu.length) {
    //         this.menu = this.role.menu;
    //       }
    //     });
    //   this.droit = this.role.droits;
    //   //this.subscriptions.push(subs);
    // }
  }

  // if (this.tab.value === 'edition') {
  //   this.role = new Role();
  //   this.edition = true;

  //   this.lecture = false;

  // loadExistingResources() {
  //   if (this.back) this.loadRestrictionsBack();
  //   else this.loadRestrictionsExtranet();
  //   this.loadEntite();
  // }

  loadRestrictionsBack() {
    let menuUrl = `assets/mock-apis/menu-${environment.client}.json`;
    this.http
      .get<NavOption[]>(menuUrl)
      .pipe(
        map((res) => {
          this.menu = this.menu.concat(res);
          this.getAllText();
        })
      )
      .subscribe();
  }

  loaddroits() {
    // let urlMenus = 'menu/appMenus';
    // this.httpClientService.post({}, urlMenus).subscribe((dataMenus) => {
    //   this.menu = dataMenus;
    // });
    this.httpClientService
      .get(`assets/mock-apis/droits-${environment.client}.json`)
      .pipe(
        map((res) => {
          this.droit = res;
        })
      )
      .subscribe();
  }

  loadRestrictionsExtranet() {
    let menuUrl = `assets/mock-apis/extranet-menu-${environment.client}.json`;
    this.http
      .get<NavOption[]>(menuUrl)
      .pipe(
        map((res) => {
          this.menu = this.menu.concat(res);

          this.http
            .get<NavOption[]>(
              `assets/mock-apis/extranet-header-${environment.client}.json`
            )
            .pipe(
              map((res) => {
                this.menu = this.menu.concat(res);

                this.getAllRef();
              })
            )
            .subscribe();
        })
      )
      .subscribe();
  }

  // loadEntite() {
  //   this.entiteService.recouperChampsdEntite(this.selectedEntity).pipe(
  //     map((res) => {
  //       if (res)
  //         this.champs = res;
  //       this.entiteService.setReqMap(this.selectedEntity, res);
  //     }),
  //     catchError((err) => {
  //       this.champs = [];
  //       throw err;
  //     })
  //   ).subscribe();
  // }

  async loadEntite() {
    if (this.selectedEntity) {
      try {
        const res = await this.entiteService.recouperChampsdEntite(
          this.selectedEntity.entite
        );
        if (res) {
          this.champs = res;
          this.entiteService.setReqMap(this.selectedEntity.entite, res);
        }
      } catch (error) {
        this.champs = [];
        throw error;
      }
    } else {
      this.champs = [];
    }
  }
  getAllRef() {
    this.menu.forEach((el: any) => {
      if (el?.subMenu) this.menu = this.menu.concat(el.subMenu);
    });

    this.menu = this.menu.map((el: any) => el.ref);
  }
  getAllText() {
    this.menu.forEach((el: any) => {
      if (el?.children) this.menu = this.menu.concat(el.children);
    });

    this.menu = this.menu.map((el: any) => el.text);
  }

  // isIn(element: 'menu' | 'champs' | 'fonctions', ref: string): boolean {
  //   if (element == 'champs') ref = `${this.selectedEntity.entite}:${ref}`;
  //   return this.restrictions?.[element].includes(ref);
  // }

  // select(element: 'menu' | 'champs' | 'fonctions', ref: string) {
  //   let reff =
  //     element == 'champs' ? `${this.selectedEntity.entite}:${ref}` : ref;

  //   if (this.isIn(element, ref)) {
  //     this.restrictions[element] = this.restrictions?.[element].filter(
  //       (el: any) => el != reff
  //     );
  //   } else {
  //     this.restrictions[element].push(reff);
  //   }
  // }

  // save() {
  //   this.dialogRef.close('save');
  // }

  changeSelections(event: Event) {}
}
