import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DashboardComponent } from 'src/app/admin/core/components/dashboard/dashboard.component';
import { HttpclientService } from 'src/app/admin/core/services/httpclientService';
import { UtilService } from 'src/app/admin/core/services/utilService';
import { TemplateService } from 'src/app/services/template.service';
import { SousParametre } from 'src/app/shared/entities/sous-parametre';
import { Template } from 'src/app/shared/entities/template';
import { AlertService } from 'src/app/shared/services/alert-service';
import { DialogComponent } from '../../dialogs/dialog.component';
import { Subscription } from 'rxjs';
import { Parametre } from 'src/app/shared/entities/parametre';
import { DiaologHostComponent } from '../../dialogs/dialog-host/dialog-host';
import { N } from '@angular/cdk/keycodes';
import { Row } from '../../../entities/row';
import { Col } from '../../../entities/col';
import { Tab } from '@syncfusion/ej2-angular-navigations';

@Component({
  selector: 'app-template-deux-colonne-edition',
  templateUrl: './template-deux-colonne-edition.component.html',
  styleUrls: ['./template-deux-colonne-edition.component.css'],
}) /*, OnChanges*/
export class TemplateDeuxColonneEditionComponent implements OnInit {
  edition: boolean;
  lecture: boolean;

  @Input() public tab: any;
  @Input() public template: Template;

  @Output() sendTemplate: EventEmitter<Template> = new EventEmitter<Template>();

  current: Template = new Template();

  imageFile: File;
  file: File;
  fileVide: File;
  place: number;
  selectedFiles: FileList;
  selectedFileNames: string[] = [];
  nameOrTitre: string;

  positionnementImage: number;

  subscriptions: Subscription[] = [];
  message: any;

  constructor(
    private httpclientService: HttpclientService,
    private templateService: TemplateService,
    private dash: DashboardComponent,
    private utilService: UtilService,
    private alertService: AlertService,
    private dialog: MatDialog
  ) {}

  /*ngOnChanges(changes: SimpleChanges): void {
    if(changes['template'].firstChange){
      
    }
  }*/
  ngOnInit(): void {
    this.edition = true;
    this.lecture = false;

    this.current = this.template;

    //

    //on appel
    //setTimeout(() => {

    //}, 100);

    //
  }

  /** cette methode permet d'ajouter une ligne a une Interface commet tels, emails, faxes */
  addSousParametreInterface(ligne: any, nbTab: any, nbRow: any, nbCol: any) {
    let param = new SousParametre();
    let paramValeur = new SousParametre();
    let paramId = new SousParametre();
    paramId.label = 'id';
    paramId.valeur = '';
    paramValeur.valeur = '';
    paramValeur.type = 'text';
    paramId.type = 'text';
    let label = null;

    label =
      this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[ligne]
        .label;
    switch (label) {
      case 'tels':
        paramValeur.label = 'numero';
        param.label = `tel_${
          this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[
            ligne
          ].parametres.length + 1
        }`;
        break;
      case 'emails':
        paramValeur.label = 'valeur';
        param.label = `email_${
          this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[
            ligne
          ].parametres.length + 1
        }`;
        break;
      case 'faxes':
        paramValeur.label = 'numero';
        param.label = `fax_${
          this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[
            ligne
          ].parametres.length + 1
        }`;
    }
    param.type = 'class';
    param.parametres.push(paramId);
    param.parametres.push(paramValeur);
    //
    this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[
      ligne
    ].parametres.push(param);
  }

  /**** permet d'attribuer une entite à une interface Link */
  addParamInterfaceLinkLayout(
    ligne: any,
    nbTab: any,
    nbRow: any,
    nbCol: any,
    value: any
  ) {
    //
    let parametreDefaut = new SousParametre();
    //on recupere la valeur par défaut
    let nom = this.template.layout.tabs[nbTab].rows[nbRow].cols[
      nbCol
    ].parameters[ligne].name.substring(
      0,
      this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[ligne]
        .name.length - 1
    );
    let param =
      this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[ligne]
        .parametres[0];
    parametreDefaut.label = `${nom} ${this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[ligne].parametres.length}`;
    // on crée un sous Paramètre par defaut avant de l'actualiser
    this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[
      ligne
    ].parametres[0].parametres.map((p) => {
      let sousParametre = new SousParametre();
      sousParametre.label = p.label;
      sousParametre.type = 'text';
      sousParametre.valeur = '';
      //
      parametreDefaut.parametres.push(sousParametre);
    });

    parametreDefaut.parametres.map((item) => {
      if (item.label === 'id') {
        item.valeur = value.id;
      } else if (item.label === 'nom') {
        item.valeur = value.nom;
      } else if (item.label === 'titre') {
        item.valeur = value.titre;
      } else if (item.label === 'code') {
        item.valeur = value.code;
      } else if (item.label === 'perecode') {
        item.valeur = value.perecode;
      } else if (item.label === 'topcode') {
        item.valeur = value.topcode;
      } else if (item.label === 'prenom') {
        item.valeur = value.prenom;
      } else if (item.label === 'valeur') {
        item.valeur = value.valeur;
      } else if (item.label === 'nomTable') {
        item.valeur = value.nomTable;
      }
    });

    if (
      this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[ligne]
        .parametres.length == 1 &&
      (this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[
        ligne
      ].parametres[0].parametres[0].valeur == null ||
        this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[
          ligne
        ].parametres[0].parametres[0].valeur == '')
    ) {
      this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[
        ligne
      ].parametres.splice(0, 1);
      //this.template.colonnedroite[num].parametres.splice(0,1)
    }
    this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[
      ligne
    ].parametres.push(parametreDefaut);
  }

  /** permet de séléctionner une entité de link */
  addParamClassLayout(
    ligne: any,
    nbTab: any,
    nbRow: any,
    nbCol: any,
    value: any
  ) {
    this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[
      ligne
    ].parametres.map((item) => {
      if (item.label === 'id') {
        item.valeur = value.id;
      } else if (item.label === 'nom') {
        item.valeur = value.nom;
      } else if (item.label === 'titre') {
        item.valeur = value.titre;
      } else if (item.label === 'famille') {
        item.valeur = value.famille;
      } else if (item.label === 'code') {
        item.valeur = value.code;
      }
    });
  }

  /************ */
  /*** permet d'attribuer à l'id et le nom à une Interface List en string*/
  addParamTosimpleListLayout(
    ligne: any,
    nbTab: any,
    nbRow: any,
    nbCol: any,
    value: any
  ) {
    this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[ligne]
      .label.length - 1;

    let parametreDefaut = new SousParametre();
    //on recupere la valeur par défaut
    let nom = this.template.layout.tabs[nbTab].rows[nbRow].cols[
      nbCol
    ].parameters[ligne].name.substring(
      0,
      this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[ligne]
        .label.length - 1
    );
    //let param = this.template.colonnedroite[num].parametres[0];
    parametreDefaut.label = `${nom} ${this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[ligne].parametres.length}`;

    parametreDefaut.id = value.id;

    parametreDefaut.valeur = value.id;
    // on attribue la valeur récuperée
    if (
      this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[ligne]
        .parametres.length == 1 &&
      (this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[
        ligne
      ].parametres[0].valeur == null ||
        this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[
          ligne
        ].parametres[0].valeur == '')
    ) {
      this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[
        ligne
      ].parametres.splice(0, 1);
    }
    //on verifie si l'id existe déjà pour eviter les doublons
    let find = false;
    this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[
      ligne
    ].parametres.map((item) => {
      if (item.valeur === parametreDefaut.valeur) {
        find = true;
      }
    });
    if (!find) {
      this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[
        ligne
      ].parametres.push(parametreDefaut);
    }
  }
  /**** pour séléctionner un  object exemple type de personne, civilité etct ****/
  selectObjetLayout(
    ligne: any,
    nbTab: any,
    nbRow: any,
    nbCol: any,
    value: any,
    parametre: any
  ) {
    this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[
      ligne
    ].parametres.map((item) => {
      if (item.label === 'id') {
        item.valeur = value.id;
      } else if (item.label === 'nom') {
        item.valeur = value.nom;
      } else if (item.label === 'titre') {
        item.valeur = value.titre;
      } else if (item.label === 'famille') {
        item.valeur = value.famille;
      } else if (item.valeur === 'valeur') {
        item.valeur = value.valeur;
      }
    });
  }
  /*** permet de supprimer une entite dans une interface Link */
  retirerSousParamInterfaceLinK(
    ligne: any,
    nbTab: any,
    nbRow: any,
    nbCol: any,
    index: any
  ) {
    let parametreDefaut = new SousParametre();
    //on verifie si n'est pas la dernière ligne
    if (
      this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[ligne]
        .parametres.length == 1
    ) {
      this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[
        ligne
      ].parametres[index].parametres.map((item) => {
        item.valeur = '';
      });
      parametreDefaut =
        this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[
          ligne
        ].parametres[index];
    } else {
      this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[
        ligne
      ].parametres.splice(index, 1);
    }
  }
  /*** pour restaurer un parametre afin de le vider toutes informations */
  restoreParamClassLayout(ligne: any, nbTab: any, nbRow: any, nbCol: any) {
    this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[
      ligne
    ].parametres.map((item) => {
      item.valeur = '';
    });
  }
  /*************************** */
  retirerSimpleSousParamLayout(
    ligne: any,
    index: any,
    nbTab: any,
    nbRow: any,
    nbCol: any
  ) {
    let parametreDefaut = new SousParametre();
    if (
      this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[ligne]
        .parametres.length == 1
    ) {
      this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[
        ligne
      ].parametres[index].valeur = '';
    } else {
      this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[
        ligne
      ].parametres.splice(index, 1);
    }
  }

  uploadImageLayout(
    file: any,
    nbTab: number,
    nbRow: number,
    nbCol: number,
    ligne: number,
    test: any
  ) {
    //on verifie si c'est une simple class, une Map ou une Interface
    const headers = {};
    //

    let path;
    this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[
      ligne
    ].file = file.target.files[0];
    path =
      this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[ligne]
        .request;
    //
    if (
      this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[ligne]
        .file
    ) {
      if (
        this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[
          ligne
        ].file.type != 'image/jpeg' &&
        this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[
          ligne
        ].file.type != 'image/png' &&
        this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[
          ligne
        ].file.type != 'image/jpg'
      ) {
        this.tab.dialogName = 'popup';
        this.tab.msg = `Le fichier n'est pas une image`;
        let dialogRef = this.dialog.open(DiaologHostComponent, {
          panelClass: 'filtre-dialog-component',
          data: {
            title: 'Erreur',
            msg: this.tab.msg,
            tab: this.tab,
          },
        });
        return;
      } else {
        const formData = new FormData();
        if (
          this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[
            ligne
          ].type.includes('HashMap')
        ) {
          this.positionnementImage =
            this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[
              ligne
            ].parametres.length;
          formData.append(
            'file',
            this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[
              ligne
            ].file
          );
          formData.append('path', `${path}${this.positionnementImage}/`);
          this.httpclientService
            .postWithHeader(formData, headers, '/image/addphoto/path')
            .subscribe((data) => {
              let parametreDefaut = new SousParametre();
              let find = false;
              for (
                let i = 0;
                i <
                this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol]
                  .parameters[ligne].parametres.length;
                i++
              ) {
                if (
                  this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol]
                    .parameters[ligne].parametres[i].parametres[0].valeur ==
                  null
                ) {
                  this.template.layout.tabs[nbTab].rows[nbRow].cols[
                    nbCol
                  ].parameters[ligne].parametres[i].parametres.map(
                    (sousparam) => {
                      if (sousparam.label === 'id') {
                        sousparam.valeur = data.id;
                      } else if (sousparam.label === 'nom') {
                        sousparam.valeur = data.nom;
                      } else if (sousparam.label === 'code') {
                        sousparam.valeur = data.code;
                      } else if (sousparam.label === 'url') {
                        sousparam.valeur = data.url;
                      }
                    }
                  );
                  find = true;
                }
              }
              if (!find) {
                this.template.layout.tabs[nbTab].rows[nbRow].cols[
                  nbCol
                ].parameters[ligne].parametres[0].parametres.map((p) => {
                  let sousParametre = new SousParametre();
                  sousParametre.label = p.label;
                  sousParametre.type = 'text';
                  sousParametre.valeur = '';
                  parametreDefaut.parametres.push(sousParametre);
                });
                // on initialise les données dans le nouveau sousParametre
                parametreDefaut.parametres.map((sousparam) => {
                  if (sousparam.label === 'id') {
                    sousparam.valeur = data.id;
                  } else if (sousparam.label === 'nom') {
                    sousparam.valeur = data.nom;
                  } else if (sousparam.label === 'code') {
                    sousparam.valeur = data.code;
                  } else if (sousparam.label === 'url') {
                    sousparam.valeur = data.url;
                  }
                });
                this.template.layout.tabs[nbTab].rows[nbRow].cols[
                  nbCol
                ].parameters[ligne].parametres.push(parametreDefaut);
              }
            });
        } else if (
          this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[
            ligne
          ].type.startsWith('class')
        ) {
          this.positionnementImage =
            this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[
              ligne
            ].parametres.length;
          formData.append(
            'file',
            this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[
              ligne
            ].file
          );
          formData.append(
            'path',
            `${path}${this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[ligne].name}/IMG/`
          );
          this.httpclientService
            .postWithHeader(formData, headers, '/image/addphoto/path')
            .subscribe((data) => {
              this.template.layout.tabs[nbTab].rows[nbRow].cols[
                nbCol
              ].parameters[ligne].parametres.map((sousparam) => {
                if (sousparam.label === 'id') {
                  sousparam.valeur = data.id;
                } else if (sousparam.label === 'nom') {
                  sousparam.valeur = data.nom;
                } else if (sousparam.label === 'code') {
                  sousparam.valeur = data.code;
                } else if (sousparam.label === 'url') {
                  sousparam.valeur = data.url;
                }
              });
            });
          //
        }
      }
    }
    test.file = File;
  }

  removeImageLayout(
    ligne: any,
    index: any,
    valueImage: SousParametre,
    nbTab: any,
    nbRow: any,
    nbCol: any
  ) {
    let parametreDefaut = new SousParametre();
    let id;
    //
    if (
      this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[
        ligne
      ].type.includes('HashMap')
    ) {
      valueImage.parametres.map((item) => {
        if (item.label === 'id') {
          id = item.valeur;
        }
      });
      let url = `image/delete/${id}`;

      // on supprime
      this.templateService.deleteImage(url).subscribe((del) => {
        // on initialise un parametre par défaut
        this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[
          ligne
        ].parametres[0].parametres.map((p) => {
          let sousParametre = new SousParametre();
          sousParametre.label = p.label;
          sousParametre.type = 'text';
          sousParametre.valeur = '';
          parametreDefaut.parametres.push(sousParametre);
        });

        //on verifie
        if (
          this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[
            ligne
          ].parametres.length == 1
        ) {
          this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[
            ligne
          ].parametres[0].parametres.map((p) => {
            let sousParametre = new SousParametre();
            sousParametre.label = p.label;
            sousParametre.type = 'text';
            sousParametre.valeur = '';
            parametreDefaut.parametres.push(sousParametre);
          });
        } else {
          this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[
            ligne
          ].parametres.splice(index, 1);
          this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[
            ligne
          ].parametres.push(parametreDefaut);
        }
      });
    } else if (
      this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[
        ligne
      ].type.startsWith('class')
    ) {
      //

      this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[
        ligne
      ].parametres.map((item) => {
        if (item.label === 'id') {
          id = item.valeur;
        }
      });
      let url = `image/delete/${id}`;
      this.templateService.deleteImage(url).subscribe((del) => {
        // on initialise un parametre par défaut
        this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[
          ligne
        ].parametres.map((param) => {
          param.valeur = '';
        });
      });
    }
  }

  /****permet de supprimer un object dans uen interface  */
  retirerSousParam(val: any, num: any, position: string) {
    let parametreDefaut = new SousParametre();
    if (position === 'droite') {
      if (this.template.colonnedroite[val].parametres.length == 1) {
        this.template.colonnedroite[val].parametres[num].parametres.map(
          (item) => {
            item.valeur = '';
          }
        );
        parametreDefaut = this.template.colonnedroite[val].parametres[num];
      } else {
        this.template.colonnedroite[val].parametres.splice(num, 1);
      }
    } else {
      if (this.template.colonnegauche[val].parametres.length == 1) {
        this.template.colonnegauche[val].parametres[num].parametres.map(
          (item) => {
            item.valeur = '';
          }
        );
        parametreDefaut = this.template.colonnegauche[val].parametres[num];
      } else {
        this.template.colonnegauche[val].parametres.splice(num, 1);
      }
      //  }
    }
  }

  addSousParametre(value: any, position: string) {
    let param = new SousParametre();
    let paramValeur = new SousParametre();
    let paramId = new SousParametre();
    paramId.label = 'id';
    paramId.valeur = '';
    paramValeur.valeur = '';
    paramValeur.type = 'text';
    paramId.type = 'text';
    let label = null;
    if (position === 'droite') {
      label = this.template.colonnedroite[value].label;
    } else if (position === 'gauche') {
      label = this.template.colonnegauche[value].label;
    }
    switch (label) {
      case 'tels':
        paramValeur.label = 'numero';
        param.label = `tel_${
          this.template.colonnegauche[value].parametres.length + 1
        }`;
        break;
      case 'emails':
        paramValeur.label = 'valeur';
        param.label = `email_${
          this.template.colonnegauche[value].parametres.length + 1
        }`;
        break;
      case 'faxes':
        paramValeur.label = 'numero';
        param.label = `fax_${
          this.template.colonnegauche[value].parametres.length + 1
        }`;
    }

    param.type = 'class';
    param.parametres.push(paramId);
    param.parametres.push(paramValeur);
    if (position === 'droite') {
      this.template.colonnedroite[value].parametres.push(param);
    } else {
      this.template.colonnegauche[value].parametres.push(param);
    }
  }

  onsearcheRefLayout(
    event: any,
    request: string,
    ligne: any,
    nbTab: any,
    nbRow: any,
    nbCol: any
  ) {
    const value = event;
    if (value) {
      this.templateService
        .requestApi(`${request}${value}`)
        .subscribe((result) => {
          this.template.layout.tabs[nbTab].rows[nbRow].cols[nbCol].parameters[
            ligne
          ].list = result;
        });
    }
  }

  enregistrer() {
    this.httpclientService
      .post(this.template, '/template/edition')
      .subscribe((res: any) => {
        this.template = res;

        if (this.template.layout != null) {
          this.template.layout.tabs.map((tab) =>
            tab.rows.map((row) =>
              row.cols.map((col) =>
                col.parameters.map((param) => {
                  if (
                    (param.name === 'titre' ||
                      param.name === 'nom' ||
                      param.name === 'code') &&
                    this.template.entite != 'variableLogistique'
                  ) {
                    // alert(`${param.name} ${param.valeur}`)
                    this.nameOrTitre = param.valeur;
                  } else if (
                    param.name === 'famille' &&
                    this.template.entite === 'pictoCatalogue'
                  ) {
                    this.nameOrTitre = param.valeur;
                  }
                  if (this.template.entite === 'variableLogistique') {
                    let conditionnemet: any;
                    if (param.name === 'mapDescriptionVl') {
                      param.parametres.map((par) => {
                        if (par.label === 'fr_FR') {
                          this.nameOrTitre = par.valeur;
                        }
                      });
                    }
                  }
                })
              )
            )
          );
        } else {
          this.template.colonnedroite.map((item) => {
            if (
              (item.name === 'titre' ||
                item.name === 'nom' ||
                item.name === 'code' ||
                item.name === 'famille') &&
              item.valeur
            ) {
              this.nameOrTitre = item.valeur;
            }
          });
          this.template.colonnegauche.map((item) => {
            if (
              (item.name === 'titre' ||
                item.name === 'nom' ||
                item.name === 'code' ||
                item.name === 'famille') &&
              item.valeur
            ) {
              this.nameOrTitre = item.valeur;
            }
          });
        }

        this.dash.changeNameOrTitleAfterSave(this.tab, this.nameOrTitre);
        this.sendTemplate.emit(this.template);
      });
  }

  rafraichir() {
    this.current = this.template;
  }

  cancel() {
    let find;
    this.template.colonnegauche.map((item) => {
      if (item.name === 'id' && item.valeur) {
        find = true;
      }
    });
    this.template.colonnedroite.map((item) => {
      if (item.name === 'id' && item.valeur) {
        find = true;
      }
    });
    if (find) {
      this.sendTemplate.emit(this.current);
    } else {
      //on ferme l'onglet
      this.dash.openPrev(this.tab);
    }
  }

  supprimer() {
    let dialogRef = this.dialog.open(DialogComponent, {
      panelClass: 'filtre-dialog-component',
      width: '500px',
      data: {
        title: 'Confirmation de la suppression',
        msg: `Voulez-vous vraiment supprimer`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        let id = this.tab.id;
        let url = `${this.template.entite}/delete/${id}`;
        let sub = this.httpclientService.get<any>(url).subscribe((res) => {
          if (res.status == '200') {
            this.edition = false;
            this.lecture = true;
            this.alertService.confirmDialog({
              title: '',
              message:
                (this.message = `le supression de ${this.template.entite} a réussit`),
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

  hasTitleOnRow(row: Row) {
    return row.title !== '';
  }

  hasTitleOnCols(cols: Col[]) {
    return (
      cols.filter((col: Col) => col.title != null && col.title.trim()).length >
      0
    );
  }
}
