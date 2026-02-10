import {
  ComponentRef,
  Injectable,
  Input,
  ViewContainerRef,
} from '@angular/core';
import { BibliothequeMultimediaComponent } from 'src/app/shared/components/bibliotheque-multimedia/bibliotheque-multimedia.component';
import { CategorieComponent } from 'src/app/shared/components/categorie/categorie.component';
import { CreerPersonnephysiqueComponent } from 'src/app/shared/components/creer-personnephysique/creer-personnephysique.component';
import { TableComponent } from 'src/app/shared/components/dynamic-component-shared/table/table.component';
import { PersonMoraleComponent } from 'src/app/shared/components/personnemorale/personnemorale.component';
import { ProduitAdminComponent } from 'src/app/shared/components/produit-admin/produit-admin.component';
import { VisualisationComponent } from 'src/app/shared/components/dialogs/visualisation/visualisation.component';
import { Tables } from 'src/app/shared/entities/tables';
import { AdminHomePageComponent } from '../pages/admin-home-page/admin-home-page.component';
import { Observable, of } from 'rxjs';
import { HttpclientService } from './httpclientService';
import { EntiteChamp } from 'src/app/shared/entities/champ/entitechamp';
import { FiltrePredifiniDialogComponent } from 'src/app/shared/components/dialogs/filtre-predifini-dialog/filtre-predifini-dialog.component';
import { ViewDto } from 'src/app/shared/entities/viewdto';
import { SuppressionDialogComponent } from 'src/app/shared/components/dialogs/suppression-dialog/suppression-dialog.component';
import { ChampsComponent } from 'src/app/shared/components/champs/champs.component';
import { AdminUserGroupParameterComponent } from 'src/app/shared/components/admin-user-group-parameter/admin-user-group-parameter.component';
import { UserComponent } from 'src/app/shared/components/user/user.component';
import { EmailPopupDialogComponent } from 'src/app/shared/components/dialogs/email-popup-dialog/email-popup-dialog.component';
import { FiltrerChampComponent } from '../../../shared/components/dialogs/filtrer-champ/filtrer-champ.component';
import { ImportFichierComponent } from '../../../shared/components/dialogs/import-fichier/import-fichier.component';

import { ActualiteComponent } from 'src/app/shared/components/actualite/actualite.component';
import { ExportFichierComponent } from 'src/app/shared/components/dialogs/export-fichier/export-fichier.component';
import { ClosePopupComponent } from 'src/app/shared/components/dialogs/close-popup/close-popup.component';
import { TemplateEditComponent } from 'src/app/shared/components/template-edit/template-edit.component';
import { LayoutConditionsComponent } from '../../../shared/components/dialogs/layout-conditions/layout-conditions.component';
import { ConfirmationDialogComponent } from '../../../shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { FonctionalitesComponent } from 'src/app/shared/components/dialogs/restrictions/fonctionalites/fonctionalites.component';
import { ArchivesComponent } from 'src/app/shared/components/dialogs/archives/archives.component';
import { TaskSchedulerComponent } from 'src/app/shared/components/dynamic-component-shared/task-scheduler/task-scheduler.component';

@Injectable({ providedIn: 'root' })
export class EntityService {
  private requestMap: Map<string, any> = new Map();

  constructor(private httpClient: HttpclientService) {}

  async recouperChampsdEntite(entite: string): Promise<EntiteChamp[]> {
    if (this.requestMap.get(entite)) {
      return Promise.resolve(this.requestMap.get(entite));
    } else {
      // this.requestMap.set(entite, { waiting: true });
      let url = 'entite/champs/';
      switch (entite) {
        case 'catalog':
          entite = 'CatalogDto';
          url += `${entite}`;
          break;
        case 'personnemorale':
          entite = 'PersonneMoraleDto';
          url += `${entite}`;
          break;
          case 'adaptationplaque':
            entite = 'AdaptationplaqueDto';
            url += `${entite}`;
            break;
        case 'personnephysique':
          entite = 'PersonnePhysiqueDto';
          url += `${entite}`;
          break;
        case 'accueil':
          entite = 'PersonneMoraleDto';
          url += `${entite}`;
          break;

        case 'categorie':
          entite = 'CategorieDto';
          url += `${entite}`;
          break;
        case 'produit':
          entite = 'ProduitDto';
          url += `${entite}`;
          break;
          case 'produitarchive':
            
            entite = 'ProduitArchiveDto';
            url += `${entite}`;
       
            break;
        case 'images':
          entite = 'ImageDto';
          url += `${entite}`;
          break;
        case 'user':
          entite = 'UserDto';
          url += `${entite}`;
          break;
        case 'actualite':
          entite = 'ActualiteDto';
          url += `${entite}`;
          break;
        case 'role':
          entite = 'RoleDto';
          url += `${entite}`;
          break;
        case 'parametre':
          entite = 'ParametreDto';
          url += `${entite}`;
          break;
        case 'variablelogistique':
          entite = 'VariableLogistiqueDto';
          url += `${entite}`;
          break;
          case 'variablelogistiquearchive':
            entite = 'VariableLogistiqueArchiveDto';
            url += `${entite}`;
            break;
        case 'pictocatalogue':
          entite = 'PictoCatalogueDto';
          url += `${entite}`;
          break;
        case 'picto':
          entite = 'PictoDto';
          url += `${entite}`;
          break;
        case 'profile':
          entite = 'ProfileDto';
          url += `${entite}`;
          break;
        case 'page':
          entite = 'PageDto';
          url += `${entite}`;
          break;
        default:
          url += `${entite + 'Dto'}`;
          break;
      }
      try {
        const response = await this.httpClient.get(url).toPromise();
        if (response) {
          this.requestMap.set(entite, response as EntiteChamp[]);
         
          return response as EntiteChamp[];
        }
       
      } catch (error) {
        console.error('Error fetching entity fields:', error);
        throw error; // Rethrow the error for the caller to handle
      }
    }
    return Promise.resolve(this.requestMap.get(entite));
  }

  // recouperChampsdEntite(entite: string): Observable<EntiteChamp[]> {
  //   if (this.requestMap.get(entite)) {
  //     return of(this.requestMap.get(entite));
  //   } else {
  //     this.requestMap.set(entite, {waiting: true});
  //     let url = 'entite/champs/';
  //     switch (entite) {
  //       case 'personnemorale':
  //         entite = 'PersonneMoraleDto';
  //         url += `${entite}`;
  //         break;
  //       case 'personnephysique':
  //         entite = 'PersonnePhysiqueDto';
  //         url += `${entite}`;
  //         break;
  //       case 'accueil':
  //         entite = 'PersonneMoraleDto';
  //         url += `${entite}`;
  //         break;

  //       case 'categorie':
  //         entite = 'CategorieDto';
  //         url += `${entite}`;
  //         break;
  //       case 'produit':
  //         entite = 'ProduitDto';
  //         url += `${entite}`;
  //         break;
  //       case 'images':
  //         entite = 'ImageDto';
  //         url += `${entite}`;
  //         break;
  //       case 'user':
  //         entite = 'UserDto';
  //         url += `${entite}`;
  //         break;
  //       case 'actualite':
  //         entite = 'ActualiteDto';
  //         url += `${entite}`;
  //         break;
  //       case 'role':
  //         entite = 'RoleDto';
  //         url += `${entite}`;
  //         break;
  //       case 'parametre':
  //         entite = 'ParametreDto';
  //         url += `${entite}`;
  //         break;
  //       case 'variablelogistique':
  //         entite = 'VariableLogistiqueDto';
  //         url += `${entite}`;
  //         break;
  //       case 'pictocatalogue':
  //         entite = 'PictoCatalogueDto';
  //         url += `${entite}`;
  //         break;
  //       case 'picto':
  //         entite = 'PictoDto';
  //         url += `${entite}`;
  //         break;
  //       case 'profile':
  //         entite = 'ProfileDto';
  //         url += `${entite}`;
  //         break;
  //       case 'page':
  //         entite = 'PageDto';
  //         url += `${entite}`;
  //         break;
  //     }

  //     return this.httpClient.get(url);
  //   }

  // }

  setReqMap(entite: string, res: any) {
    this.requestMap.set(entite, res);
  }

  component: any;
  /***
   * @param
   */
  async loadComponent(vcf: ViewContainerRef, tab: Tables, value: string) {
    if (tab.isTable) {
      this.component = TableComponent;
    } else {
      switch (tab.entite.toLocaleLowerCase()) {
        case 'accueil':
          this.component = AdminHomePageComponent;
          break;
        case 'personnemorale':
        case 'parametre':
        case 'personnephysique':
        case 'categorie':
        case 'produit':
        case 'produitarchive':
        case 'pictocatalogue':
        case 'picto':
        case 'variablelogistique':
          case 'variablelogistiquearchive':
        case 'adaptationplaque':
          this.component = TemplateEditComponent;
          //this.component = PersonMoraleComponent;
          break;

        case 'bibliotheque':
          this.component = BibliothequeMultimediaComponent;
          break;
        case 'profile':
          this.component = TemplateEditComponent;
          break;
        case 'page':
          this.component = TemplateEditComponent;
          break;
        case 'champs':
          this.component = ChampsComponent;
          break;
        case 'role':
          this.component = AdminUserGroupParameterComponent;
          break;
        case 'user':
          this.component = UserComponent;
          break;
        case 'actualite':
          this.component = ActualiteComponent;
          break;
        case 'parametre':
          this.component = TemplateEditComponent;
          break;
        case 'catalog':
          this.component = TemplateEditComponent;
          break;
      }
    }

    let componentInstance: ComponentRef<typeof this.component> =
      vcf.createComponent(this.component);
    componentInstance.setInput('tab', tab);
    componentInstance.setInput('value', value);
  }

  async loadDialogComponent(vcf: ViewContainerRef, tab: Tables) {
    switch (tab.dialogName) {
      case 'visualisation':
        this.component = VisualisationComponent;
        break;
      case 'filterpredefini':
        this.component = FiltrePredifiniDialogComponent;
        break;
      case 'confirmation':
        this.component = ConfirmationDialogComponent;
        break;
      case 'supprime':
        this.component = SuppressionDialogComponent;
        break;
      case 'popup':
        this.component = EmailPopupDialogComponent;
        break;
      case 'close':
        this.component = ClosePopupComponent;
        break;
      case 'import-fichier':
        this.component = ImportFichierComponent;
        break;
      case 'export-fichier':
        this.component = ExportFichierComponent;
        break;
      case 'filter-champ':
        this.component = FiltrerChampComponent;
        break;
      case 'layout-conditions':
        this.component = LayoutConditionsComponent;
        break;
      case 'fonctionalite':
        this.component = FonctionalitesComponent;
        break;
      case 'archives':
        this.component = ArchivesComponent;
        break;
      case 'scheduler':
        this.component = TaskSchedulerComponent;
        break;
    }

    let componentInstance: ComponentRef<typeof this.component> =
      vcf.createComponent(this.component);
    componentInstance.setInput('tab', tab);
  }
  enregistrerView(view: ViewDto, url: string) {
    return this.httpClient.post(view, url);
  }
}
