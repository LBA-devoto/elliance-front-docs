import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './admin/core/components/dashboard/dashboard.component';
import { RetrievePasswordComponent } from './shared/components/retrieve-password/retrieve-password.component';
import { ChangerMotDePasseComponent } from './shared/components/changer-mot-de-passe/changer-mot-de-passe.component';
import { AppDynamicComponent } from './shared/components/dynamic-component-shared/app-dynamic.component';
import { ForgotPasswordComponent } from './shared/components/forgot-password/forgot-password.component';
import { LoginComponent } from './shared/components/login/login/login.component';
import { LogoutComponent } from './shared/components/logout/logout.component';
import { AccueilComponent } from './user/components/accueil/accueil.component';
import { CataloguesComponent } from './user/components/catalogues/catalogues.component';
import { FournisseursComponent } from './user/components/fournisseurs/fournisseurs.component';
import { MesDevisComponent } from './user/components/mes-devis/mes-devis.component';
import { AccountComponent } from './user/components/account/account.component';
import { BibliothequeMultimediaComponent } from './shared/components/bibliotheque-multimedia/bibliotheque-multimedia.component';
import { AssociesComponent } from './user/components/associes/associes.component';
import { DetailCatalogueComponent } from './user/components/detail-catalogue/detail-catalogue.component';
import { AdminUserGroupParameterComponent } from './shared/components/admin-user-group-parameter/admin-user-group-parameter.component';
import { GestionComponent } from './user/components/gestion/gestion.component';
import { CreateEditProductComponent } from './user/components/gestion/create-edit-product/create-edit-product.component';
import { CategorieComponent } from './shared/components/categorie/categorie.component';
import { AuthGuardService } from './shared/core/interceptors/auth-guard.service';
import { CreateDevisComponent } from './user/components/mes-devis/create-devis/create-devis.component';
import { GestionMarquesComponent } from './user/components/gestion/gestion-marques/gestion-marques.component';
import { GestionFournisseursComponent } from './user/components/gestion/gestion-fournisseurs/gestion-fournisseurs.component';
import { GestionAssocieComponent } from './user/components/gestion/gestion-associe/gestion-associe.component';
import { GestionClientsComponent } from './user/components/gestion/gestion-clients/gestion-clients.component';
import { FourAccueilComponent } from './fournisseur/components/four-accueil/four-accueil.component';
import { MonEspaceComponent } from './fournisseur/components/mon-espace/mon-espace.component';
import { MonCatalogueComponent } from './fournisseur/components/mon-catalogue/mon-catalogue.component';
import { CatalogueEurochefComponent } from './fournisseur/components/catalogue-eurochef/catalogue-eurochef.component';

export const PATHS = {
  login: 'login',
  logout: 'logout',
  admin: 'admin',
  customID: ':id',
  home: 'accueil',
  account: 'mon-compte',
  devis: 'devis',
  favorite: 'favoris',
  forgot: 'forgot-password',
  retrieve: 'retrievepassword/reset',

  modifyPassword: 'changer-mot-de-passe',
  catalogues: 'catalogues',
  fournisseur: 'fournisseur',
  monEspace: 'espace',
  monCatalogue: 'catalogue',
  monEurochef: 'catalogue-eurochef',
  suppliers: 'fournisseurs',
  product: 'product',
  bibliotheque: 'biblo',
  gestion: 'gestion',
  gestion_article: 'articles',
  gestion_fournisseurs: 'fournisseurs',
  gestion_marques: 'marques',
  gestion_associe: 'associe',
  gestion_clients: 'clients',
  categorie: 'categorie',
  associates: 'associes',
  roles: 'roles',
  projectOverview: 'project-overview',
  projectDetail: 'project-detail',
};

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: '*', redirectTo: '' },
  { path: PATHS.login, component: LoginComponent },
  { path: PATHS.logout, component: LogoutComponent },
  {
    path: PATHS.account,
    component: AccountComponent,
    canActivate: [AuthGuardService],
  },
  { path: PATHS.forgot, component: ForgotPasswordComponent },
  { path: PATHS.retrieve, component: RetrievePasswordComponent },
  { path: PATHS.modifyPassword, component: ChangerMotDePasseComponent },
  {
    path: `${PATHS.fournisseur}/${PATHS.home}`,
    component: FourAccueilComponent,
  },
  {
    path: `${PATHS.fournisseur}/${PATHS.monEspace}`,
    component: MonEspaceComponent,
  },
  {
    path: `${PATHS.fournisseur}/${PATHS.monCatalogue}`,
    component: MonCatalogueComponent,
  },
  {
    path: `${PATHS.fournisseur}/${PATHS.monEurochef}`,
    component: CatalogueEurochefComponent,
  },
  {
    path: `${PATHS.admin}/${PATHS.customID}`,
    component: DashboardComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: PATHS.home,
    component: AccueilComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: PATHS.devis,
    component: MesDevisComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: PATHS.bibliotheque,
    component: BibliothequeMultimediaComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: `${PATHS.gestion}/${PATHS.gestion_article}`,
    component: GestionComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: `${PATHS.gestion}/${PATHS.gestion_article}/edit/:id`,
    component: CreateEditProductComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: `${PATHS.gestion}/${PATHS.gestion_article}/create`,
    component: CreateEditProductComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: `${PATHS.gestion}/${PATHS.gestion_marques}`,
    component: GestionMarquesComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: `${PATHS.gestion}/${PATHS.gestion_fournisseurs}`,
    component: GestionFournisseursComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: `${PATHS.gestion}/${PATHS.gestion_associe}`,
    component: GestionAssocieComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: `${PATHS.gestion}/${PATHS.gestion_clients}`,
    component: GestionClientsComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: `${PATHS.catalogues}/:category`,
    component: CataloguesComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: `${PATHS.product}/:id`,
    component: DetailCatalogueComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: PATHS.suppliers,
    component: FournisseursComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: PATHS.associates,
    component: AssociesComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: PATHS.roles,
    component: AdminUserGroupParameterComponent,
  },
  {
    path: PATHS.categorie,
    component: CategorieComponent,
    canActivate: [AuthGuardService],
  },
  { path: PATHS.home, component: AccueilComponent },
  { path: PATHS.devis, component: MesDevisComponent },
  { path: PATHS.bibliotheque, component: BibliothequeMultimediaComponent },
  {
    path: `${PATHS.bibliotheque}/create`,
    component: BibliothequeMultimediaComponent,
  },
  { path: `${PATHS.devis}/create`, component: CreateDevisComponent },
  { path: `${PATHS.catalogues}/:category`, component: CataloguesComponent },
  { path: `${PATHS.product}/:id`, component: DetailCatalogueComponent },
  { path: PATHS.suppliers, component: FournisseursComponent },
  { path: PATHS.associates, component: AssociesComponent },
  { path: PATHS.roles, component: AdminUserGroupParameterComponent },

  {
    path: PATHS.projectOverview,
    component: AppDynamicComponent,
  },
  {
    path: PATHS.projectDetail,
    component: AppDynamicComponent,
    
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
