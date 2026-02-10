import {
  Component,
  Input,
  OnInit,
  Pipe,
  PipeTransform,
  ViewChild,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpclientService } from 'src/app/admin/core/services/httpclientService';
import { Actualite } from '../../entities/actualite';
import { TextEditorComponent } from '../text-editor/text-editor.component';
import { SiteEnable } from '../../entities/site-enable';
import { MatDialog } from '@angular/material/dialog';
import { Dialog } from '@angular/cdk/dialog';
import { DialogComponent } from '../dialogs/dialog.component';
import { Observable, Subscription } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DiaologHostComponent } from '../dialogs/dialog-host/dialog-host';
import { DashboardComponent } from 'src/app/admin/core/components/dashboard/dashboard.component';

@Component({
  selector: 'app-actualite',
  templateUrl: './actualite.component.html',
  styleUrls: ['./actualite.component.css'],
})
export class ActualiteComponent implements OnInit, PipeTransform {
  @Input() tab: any;
  @Input() value: any;

  @ViewChild('appTextEditor', { static: false })
  appTextEditor: TextEditorComponent;

  @Pipe({
    name: 'secure',
  })
  lecture = false;
  edition = false;
  notEmpty = false;

  siteEnabled: SiteEnable[];
  actualite: Actualite = new Actualite();

  subscriptions: Subscription[] = [];
  message: any;

  toppings = this._formBuilder.group({
    extarnet_1: false,
    extranet_Geolane: false,
    extranet_Eurochef: false,
  });

  status: string[] = ['Actif', 'Inactif'];
  constructor(
    private _formBuilder: FormBuilder,
    private httpClientService: HttpclientService,
    private dash: DashboardComponent,

    private dialog: MatDialog
  ) {}
  transform(value: any, ...args: any[]) {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    if (this.tab.value === 'edition') {
      this.lecture = false;
      this.edition = true;
      this.siteEnabled = [
        { nom: 'Extranet Fournisseur ', enabled: false },
        { nom: 'Extranet Associé', enabled: false },
      ];
      this.actualite.siteEnables = this.siteEnabled;
    } else if (this.tab.value === 'lecture') {
      this.lecture = true;
      this.edition = false;

      this.httpClientService
        .getObjet(this.tab.entite, this.tab.id)
        .subscribe((data) => {
          this.actualite = data;
        });
    }
  }

  uploadFile(event: any) {
    const headers = {};

    const file: File = event.target.files[0];
    
    if (file) {
      if (
        file.type != 'image/jpeg' &&
        file.type != 'image/png' &&
        file.type != 'image/jpg'
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
      } else if (file.size > 5000000) {
        this.tab.dialogName = 'popup';

        this.tab.msg = `Le fichier est trop volumineux`;
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

        formData.append('file', file);
        formData.append('path', '');

        this.httpClientService
          .postWithHeader(formData, headers, '/image/addphoto/path')
          .subscribe((data) => {
            this.actualite.image = data;
          });
      }
    }
  }
  annuler() {
    this.lecture = true;
    this.edition = false;
  }

  supprimer() {
    let dialogRef = this.dialog.open(DialogComponent, {
      panelClass: 'filtre-dialog-component',
      width: '600px',

      data: {
        title: 'Confirmation de la suppression',
        message: `Êtes-vous sûr de vouloir éffectuer cette opération`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
          let url = `${this.tab.entite}/delete/${this.tab.id}`;
          this.httpClientService.get(url).subscribe((rs) => {
            this.actualite = rs;
            this.lecture = true;
            this.edition = false;

            //pour fermer l'onglet après la suppression     
            this.dash.openPrev(this.tab);
          });
        }
      });

  }
  modeEdition() {
    this.edition = true;
    this.lecture = false;
    this.siteEnabled = [
      { nom: 'Extranet Fournisseur ', enabled: false },
      { nom: 'Extranet Associé', enabled: false },
    ];
    let temp = this.actualite.siteEnables;
    this.actualite.siteEnables = this.siteEnabled;

    temp.forEach((element) => {
      for (let i = 0; i < this.siteEnabled.length; i++) {
        if (
          element.nom === this.siteEnabled[i].nom &&
          element.enabled === true
        ) {
          this.actualite.siteEnables[i].enabled = true;
        }
      }
    });
  }
  suppressiondemasse() {}
  rafraichir() {}

  enregistrer() {
    this.actualite.content = this.appTextEditor.getContent();

    this.httpClientService
      .post(this.actualite, `/${this.tab.entite}/add`)
      .subscribe((data) => {
        this.actualite = data;
        this.edition = false;
        this.lecture = true;
      });
  }
}
