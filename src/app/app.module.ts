import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HeaderComponent } from './admin/core/components/navs/header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SideNavComponent } from './admin/core/components/navs/side-nav/side-nav.component';
import { DashboardComponent } from './admin/core/components/dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModules } from './shared/modules/material.module';
import { IconModule } from './shared/modules/icon.module';
import { SharedModule } from './shared/modules/shared.module';
import { CheckboxComponent } from './shared/components/dynamic-component-shared/checkbox/checkbox.component';
import { DropdownComponent } from './shared/components/dynamic-component-shared/dropdown/dropdown.component';
import { TextareaComponent } from './shared/components/dynamic-component-shared/textarea/textarea.component';
import { TextboxComponent } from './shared/components/dynamic-component-shared/textbox/textbox.component';
import { RadioComponent } from './shared/components/dynamic-component-shared/radio/radio.component';
import { MatTabsModule } from '@angular/material/tabs';
import { AdminHomePageComponent } from './admin/core/pages/admin-home-page/admin-home-page.component';
import { TableComponent } from './shared/components/dynamic-component-shared/table/table.component';
import {
  FormControlDirective,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { CreerPersonnephysiqueComponent } from './shared/components/creer-personnephysique/creer-personnephysique.component';
import { LoginComponent } from './shared/components/login/login/login.component';
import { MenuComponent } from './shared/components/menu/menu.component';
import { CategorieComponent } from './shared/components/categorie/categorie.component';
import { ProduitAdminComponent } from './shared/components/produit-admin/produit-admin.component';
import { DialogComponent } from './shared/components/dialogs/dialog.component';
import { PersonMoraleComponent } from './shared/components/personnemorale/personnemorale.component';
import { NgImageSliderModule } from 'ng-image-slider';
import { CdkMenuModule } from '@angular/cdk/menu';
import { MenuModule } from '@syncfusion/ej2-angular-navigations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TabContentComponent } from './shared/components/tab-content/tab-content.component';
import { LogoutComponent } from './shared/components/logout/logout.component';
import { BibliothequeMultimediaComponent } from './shared/components/bibliotheque-multimedia/bibliotheque-multimedia.component';
import { EntiteDirective } from './shared/directives/entite.directives';
import { AccueilComponent } from './user/components/accueil/accueil.component';
import { HeaderUserComponent } from './user/navs/header-user/header-user.component';
import { NotificationComponent } from './user/components/notification/notification.component';
import { FooterUserComponent } from './user/navs/footer-user/footer-user.component';
import { FournisseursComponent } from './user/components/fournisseurs/fournisseurs.component';
import { CataloguesComponent } from './user/components/catalogues/catalogues.component';
import { DetailCatalogueComponent } from './user/components/detail-catalogue/detail-catalogue.component';
import { NgxChartModule } from 'ngx-chart';
import { AssociesComponent } from './user/components/associes/associes.component';
import { MesDevisComponent } from './user/components/mes-devis/mes-devis.component';
// import { NgApexchartsModule } from 'ng-apexcharts';
import { JwtModule } from '@auth0/angular-jwt';
import { BasicAuthInterceptor } from './shared/core/interceptors/basic-auth.interceptor';
import { VisualisationComponent } from './shared/components/dialogs/visualisation/visualisation.component';
import { GenericDialogComponent } from './shared/components/dialogs/generic-dialog/generic-dialog.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FiltrePredifiniDialogComponent } from './shared/components/dialogs/filtre-predifini-dialog/filtre-predifini-dialog.component';
import { DiaologHostComponent } from './shared/components/dialogs/dialog-host/dialog-host';
import { SuppressionDialogComponent } from './shared/components/dialogs/suppression-dialog/suppression-dialog.component';
import { FooterAdminComponent } from './admin/core/components/navs/footer-admin/footer-admin.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { ChampsComponent } from './shared/components/champs/champs.component';
import { AdminUserGroupParameterComponent } from './shared/components/admin-user-group-parameter/admin-user-group-parameter.component';
import { ForgotPasswordComponent } from './shared/components/forgot-password/forgot-password.component';
import { ChangerMotDePasseComponent } from './shared/components/changer-mot-de-passe/changer-mot-de-passe.component';
import { RetrievePasswordComponent } from './shared/components/retrieve-password/retrieve-password.component';
import { ImportFichierComponent } from './shared/components/dialogs/import-fichier/import-fichier.component';
import { ExportFichierComponent } from './shared/components/dialogs/export-fichier/export-fichier.component';
import { FiltrerChampComponent } from './shared/components/dialogs/filtrer-champ/filtrer-champ.component';
import { MsalModule } from '@azure/msal-angular';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { environment } from 'src/environments/environment';
import {
  MsalGuardConfiguration,
  MsalInterceptorConfiguration,
} from '@azure/msal-angular';
import { UserComponent } from './shared/components/user/user.component';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { AccountComponent } from './user/components/account/account.component';
import { MatDividerModule } from '@angular/material/divider';
import { SearchProductComponent } from './user/components/search-product/search-product.component';
import { ConfirmRemoveComponent } from './admin/core/components/dashboard/confirm-remove/confirm-remove.component';
import { RechercheProduitComponent } from './user/components/accueil/recherche-produit/recherche-produit.component';
import { DashboardUserComponent } from './user/components/accueil/dashboard/dashboard.component';
import { NewsComponent } from './user/components/accueil/news/news.component';
import { CatalogueMenuComponent } from './user/components/catalogues/catalogue-menu/catalogue-menu.component';
import { CatalogueMenuRespComponent } from './user/components/catalogues/catalogue-menu-resp/catalogue-menu-resp.component';
import { CatalogueMenuDialogComponent } from './user/components/catalogues/catalogue-menu-dialog/catalogue-menu-dialog.component';
import { ProduitComponent } from './user/components/catalogues/produit/produit.component';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { CaracProductComponent } from './user/components/detail-catalogue/carac-product/carac-product.component';
import { MostConsultedComponent } from './user/components/detail-catalogue/most-consulted/most-consulted.component';
import { AccessoriesComponent } from './user/components/detail-catalogue/accessories/accessories.component';
import { ProductOptionsComponent } from './user/components/detail-catalogue/product-options/product-options.component';
import { FournisseurComponent } from './user/components/fournisseurs/fournisseur/fournisseur.component';
import { BurgerComponent } from './user/navs/header-user/burger/burger.component';
import { EmailPopupDialogComponent } from './shared/components/dialogs/email-popup-dialog/email-popup-dialog.component';
import { CarouselComponent } from './shared/components/carousel/carousel.component';
import { RechercheAvanceeComponent } from './user/components/mes-devis/recherche-avancee/recherche-avancee.component';
import { CguPopupComponent } from './shared/components/cgu-popup/cgu-popup.component';
import { GestionComponent } from './user/components/gestion/gestion.component';
import { CreateEditProductComponent } from './user/components/gestion/create-edit-product/create-edit-product.component';
import { ExtractEntityNamePipe } from './shared/core/pipes/entitynamepipe';
import { TemplateComponent } from './shared/components/template/template/template.component';
import { TemplateDeuxColonneEditionComponent } from './shared/components/template/template-deux-colonne-edition/template-deux-colonne-edition.component';
import { TemplateDeuxColonneLectureComponent } from './shared/components/template/template-deux-colonne-lecture/template-deux-colonne-lecture.component';
import { MatSortModule } from '@angular/material/sort';
import { TextEditorComponent } from './shared/components/text-editor/text-editor.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ActualiteComponent } from './shared/components/actualite/actualite.component';
import { CreateDevisComponent } from './user/components/mes-devis/create-devis/create-devis.component';
import { InfosDevisComponent } from './user/components/mes-devis/create-devis/infos-devis/infos-devis.component';
import { OutilsDevisComponent } from './user/components/mes-devis/create-devis/outils-devis/outils-devis.component';
import { LignesDevisComponent } from './user/components/mes-devis/create-devis/lignes-devis/lignes-devis.component';
import { ClosePopupComponent } from './shared/components/dialogs/close-popup/close-popup.component';
import { GestionMarquesComponent } from './user/components/gestion/gestion-marques/gestion-marques.component';
import { GestionFournisseursComponent } from './user/components/gestion/gestion-fournisseurs/gestion-fournisseurs.component';
import { GestionAssocieComponent } from './user/components/gestion/gestion-associe/gestion-associe.component';
import { GestionClientsComponent } from './user/components/gestion/gestion-clients/gestion-clients.component';
import { TemplateParameterComponent } from './shared/components/template/template-parameter/template-parameter.component';
import { TemplateRefactorComponent } from './shared/components/template-refactor/template-refactor.component';
import { TemplateViewComponent } from './shared/components/template-view/template-view.component';
import { TemplateEditComponent } from './shared/components/template-edit/template-edit.component';
import { FormFieldHostDirective } from './shared/directives/app-component-host.directive';
import { PrintDevisComponent } from './user/components/mes-devis/create-devis/print-devis/print-devis.component';
import { ArticleManuscritDevisComponent } from './user/components/mes-devis/create-devis/article-manuscrit-devis/article-manuscrit-devis.component';
import { FourAccueilComponent } from './fournisseur/components/four-accueil/four-accueil.component';
import { FourDashboardComponent } from './fournisseur/components/four-accueil/four-dashboard/four-dashboard.component';
import { FourNewsComponent } from './fournisseur/components/four-accueil/four-news/four-news.component';
import { FourHeaderComponent } from './fournisseur/nav/four-header/four-header.component';
import { FourBurgerComponent } from './fournisseur/nav/four-header/four-burger/four-burger.component';
import { MonEspaceComponent } from './fournisseur/components/mon-espace/mon-espace.component';
import { MonCatalogueComponent } from './fournisseur/components/mon-catalogue/mon-catalogue.component';
import { CatalogueEurochefComponent } from './fournisseur/components/catalogue-eurochef/catalogue-eurochef.component';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getFrenchPaginatorIntl } from './shared/services/paginatorIntl';
import { DataTableComponent } from './shared/components/dynamic-component-shared/data-table/data-table.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ModaleOrdreDevisComponent } from './user/components/mes-devis/create-devis/lignes-devis/modale-ordre-devis/modale-ordre-devis.component';
import { MultiLangueComponent } from './shared/components/dynamic-component-shared/multi-langue/multi-langue.component';
import { DateComponent } from './shared/components/dynamic-component-shared/date/date.component';
import { MultiSelectDropdownComponent } from './shared/components/dynamic-component-shared/multi-select-dropdown/multi-select-dropdown.component';
import { ImageComponent } from './shared/components/dynamic-component-shared/image/image.component';
import { SearchableTextfieldComponent } from './shared/components/dynamic-component-shared/searchable-textfield/searchable-textfield.component';
import { TextboxlistComponent } from './shared/components/dynamic-component-shared/textboxlist/textboxlist.component';
import { AddressComponent } from './shared/components/dynamic-component-shared/address/address.component';
import { PictoComponent } from './shared/components/dynamic-component-shared/picto/picto.component';
import { BooleanToFrenchPipe } from './shared/core/pipes/boolean-to-french-pipe';
import { LabelComponent } from './shared/components/dynamic-component-shared/label/label.component';
import { columnRenamePipe } from './shared/core/pipes/column-rename-pipe';
import { DynamicTableRowComponent } from './shared/components/dynamic-component-shared/dynamic-table-row/dynamic-table-row.component';
import { GenricTableRowComponent } from './shared/components/dynamic-component-shared/genric-table-row/genric-table-row.component';
import { LayoutConditionsComponent } from './shared/components/dialogs/layout-conditions/layout-conditions.component';
import { ConfirmationDialogComponent } from './shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { TabExtranetComponent } from './shared/components/tab-extranet/tab-extranet.component';
import { ImageColumnComponent } from './shared/components/dynamic-component-shared/table/dynamic-columns/image-column/image-column.component';
import { PrimitiveColumnComponent } from './shared/components/dynamic-component-shared/table/dynamic-columns/primitive-column/primitive-column/primitive-column.component';
import { ObjectColumnComponent } from './shared/components/dynamic-component-shared/table/dynamic-columns/object-column/object-column.component';
import { ColorColumnComponent } from './shared/components/dynamic-component-shared/table/dynamic-columns/color-column/color-column.component';
import { MultilangueColumnComponent } from './shared/components/dynamic-component-shared/table/dynamic-columns/multilangue-column/multilangue-column.component';
import { PictoColumnComponent } from './shared/components/dynamic-component-shared/table/dynamic-columns/picto-column/picto-column.component';
import { RestrictionsComponent } from './shared/components/dialogs/restrictions/restrictions/restrictions.component';
import { FonctionalitesComponent } from './shared/components/dialogs/restrictions/fonctionalites/fonctionalites.component';
import { ArchivesComponent } from './shared/components/dialogs/archives/archives.component';
import { TaskSchedulerComponent } from './shared/components/dynamic-component-shared/task-scheduler/task-scheduler.component';
import { AppMenuItemComponent } from './shared/components/menu/app-menu-item/app-menu-item.component';
import { DroitItemComponent } from './shared/components/droit-item/droit-item.component';
import { NestedValueDataTableComponent } from './shared/components/dynamic-component-shared/nested-value-data-table/nested-value-data-table.component';
import { ButtonFieldComponent } from './shared/components/dynamic-component-shared/button-field/button-field.component';
import { RxStompService } from './admin/core/services/websocket.service';
import { rxStompServiceFactory } from './admin/core/services/rx-stomp-service-factory';
import { LinkbuttonComponent } from './shared/components/dynamic-component-shared/table/dynamic-columns/linkbutton/linkbutton.component';
import { LoadingInterceptor } from './shared/core/loading-interceptor';

export const protectedResourceMap: [string, string[]][] = [
  ['https://graph.microsoft.com/v1.0/me', ['user.read']],
  [
    'https://management.azure.com',
    ['https://management.azure.com//user_impersonation'],
  ],
];

registerLocaleData(localeFr, 'fr');

const isIE =
  window.navigator.userAgent.indexOf('MSIE ') > -1 ||
  window.navigator.userAgent.indexOf('Trident/') > -1;

const msalGuardConfig: MsalGuardConfiguration = {
  interactionType: InteractionType.Popup,
  // authRequest: {
  //   scopes: ['openid', 'profile'],
  // },
  // loginFailedRoute: '/login-failed',
};

const msalInterceptorConfig: MsalInterceptorConfiguration = {
  interactionType: InteractionType.Popup,
  protectedResourceMap: new Map(),
};

@NgModule({
  declarations: [
    BooleanToFrenchPipe,
    AppComponent,
    ExtractEntityNamePipe,
    columnRenamePipe,
    HeaderComponent,
    SideNavComponent,
    DashboardComponent,
    DashboardUserComponent,
    CheckboxComponent,
    DropdownComponent,
    TextareaComponent,
    TextboxComponent,
    RadioComponent,
    AdminHomePageComponent,
    TableComponent,
    CreerPersonnephysiqueComponent,
    PersonMoraleComponent,
    LoginComponent,
    MenuComponent,
    CategorieComponent,
    ProduitAdminComponent,
    DiaologHostComponent,
    TabContentComponent,
    DialogComponent,
    LogoutComponent,
    BibliothequeMultimediaComponent,
    EntiteDirective,
    FormFieldHostDirective,
    AccueilComponent,
    HeaderUserComponent,
    NotificationComponent,
    FooterUserComponent,
    FournisseursComponent,
    CataloguesComponent,
    DetailCatalogueComponent,
    AssociesComponent,
    MesDevisComponent,
    VisualisationComponent,
    ImportFichierComponent,
    ExportFichierComponent,
    FiltrerChampComponent,
    LayoutConditionsComponent,
    GenericDialogComponent,
    FiltrePredifiniDialogComponent,
    SuppressionDialogComponent,
    ConfirmationDialogComponent,
    ChampsComponent,
    FooterAdminComponent,
    AdminUserGroupParameterComponent,
    ForgotPasswordComponent,
    ChangerMotDePasseComponent,
    RetrievePasswordComponent,
    UserComponent,
    AccountComponent,
    SearchProductComponent,
    ConfirmRemoveComponent,
    RechercheProduitComponent,
    NewsComponent,
    CatalogueMenuComponent,
    CatalogueMenuRespComponent,
    CatalogueMenuDialogComponent,
    ProduitComponent,
    CaracProductComponent,
    MostConsultedComponent,
    AccessoriesComponent,
    ProductOptionsComponent,
    FournisseurComponent,
    BurgerComponent,
    ExtractEntityNamePipe,
    TemplateComponent,
    TemplateDeuxColonneEditionComponent,
    TemplateDeuxColonneLectureComponent,
    TemplateRefactorComponent,
    EmailPopupDialogComponent,
    TemplateParameterComponent,
    TemplateEditComponent,
    CarouselComponent,
    RechercheAvanceeComponent,
    CguPopupComponent,
    GestionComponent,
    CreateEditProductComponent,
    DataTableComponent,
    TextEditorComponent,
    ActualiteComponent,
    CreateDevisComponent,
    InfosDevisComponent,
    OutilsDevisComponent,
    LignesDevisComponent,
    ClosePopupComponent,
    GestionMarquesComponent,
    GestionFournisseursComponent,
    GestionAssocieComponent,
    GestionClientsComponent,
    TemplateParameterComponent,
    TemplateRefactorComponent,
    TemplateViewComponent,
    TemplateEditComponent,
    DataTableComponent,
    PrintDevisComponent,
    ArticleManuscritDevisComponent,
    FourAccueilComponent,
    FourDashboardComponent,
    FourNewsComponent,
    FourHeaderComponent,
    FourBurgerComponent,
    MonEspaceComponent,
    MonCatalogueComponent,
    CatalogueEurochefComponent,
    ModaleOrdreDevisComponent,
    MultiLangueComponent,

    DateComponent,
    MultiSelectDropdownComponent,
    ImageComponent,
    PictoComponent,
    SearchableTextfieldComponent,
    TextboxlistComponent,
    AddressComponent,
    LabelComponent,
    DynamicTableRowComponent,
    GenricTableRowComponent,
    TabExtranetComponent,
    DynamicTableRowComponent,
    GenricTableRowComponent,
    ImageColumnComponent,
    PrimitiveColumnComponent,
    ObjectColumnComponent,
    ColorColumnComponent,
    MultilangueColumnComponent,
    PictoColumnComponent,
    RestrictionsComponent,
    FonctionalitesComponent,
    ArchivesComponent,
    TaskSchedulerComponent,
    AppMenuItemComponent,
    DroitItemComponent,
    NestedValueDataTableComponent,
    ButtonFieldComponent,
    LinkbuttonComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularEditorModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModules,

    IconModule,
    SharedModule,
    MatTabsModule,
    MatSortModule,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule,
    NgxChartModule,
    NgxImageZoomModule,
    NgApexchartsModule,
    NgImageSliderModule,
    DragDropModule,
    CdkMenuModule,
    MenuModule,
    FlexLayoutModule,
    CommonModule,
    // SocketIoModule.forRoot({
    //   url: '/task',
    //   options: {},
    // }),
    MsalModule.forRoot(
      new PublicClientApplication({
        auth: {
          clientId: environment.MSclientID, // Application (client) ID from the app registration
          authority: `https://login.microsoftonline.com/consumers`, // The Azure cloud instance and the app's sign-in audience (tenant ID, common, organizations, or consumers)
          redirectUri: environment.MSredirectUri,
        },
        cache: {
          cacheLocation: 'localStorage',
          storeAuthStateInCookie: isIE, // Set to true for Internet Explorer 11
        },
      }),
      msalGuardConfig,
      msalInterceptorConfig
    ),
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    JwtModule.forRoot({
      config: { tokenGetter: () => localStorage.getItem('token') },
    }),
  ],
  providers: [
    DatePipe,
    DecimalPipe,
    TableComponent,
    ExtractEntityNamePipe,
    columnRenamePipe,
    { provide: LOCALE_ID, useValue: 'fr' },

    { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true },
    
 
    { provide: MatPaginatorIntl, useValue: getFrenchPaginatorIntl() },
    {
      provide: RxStompService,
      useFactory: rxStompServiceFactory,
    },
  ],
  // { provide: HTTP_INTERCEPTORS, useClass: KeyClockInterceptor, multi: true },
  // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

  bootstrap: [AppComponent],
})
export class AppModule {}
