import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PATHS } from 'src/app/app-routing.module';
import { CategoryService } from 'src/app/shared/services/category.service';
import { HeaderUserComponent } from 'src/app/user/navs/header-user/header-user.component';
import { FourBurgerComponent } from './four-burger/four-burger.component';
import { RestrictService } from 'src/app/shared/services/restrict.service';
import { HttpclientService } from 'src/app/admin/core/services/httpclientService';

@Component({
  selector: 'app-four-header',
  templateUrl: './four-header.component.html',
  styleUrls: ['./four-header.component.css']
})
export class FourHeaderComponent extends HeaderUserComponent {
  constructor(
    public override router: Router,
    public override dialog: MatDialog,
    public override categoryService: CategoryService,
    public override restrictService: RestrictService,
    public override http: HttpclientService,
  ) {
    super(router, dialog, categoryService, restrictService, http);
  }

  override fillHeaderOptions() {

  }
  override fillNavOptions() {

  }

  override headerOptions = [
    {
      title: 'Mon compte',
      icon: 'person',
      route: `/${PATHS.account}`
    },
    {
      title: 'Notifications',
      icon: 'notifications',
      action: () => this.notifications()
    }
  ];

  override navOptions = [
    {
      ref: 'accueil',
      title: 'Accueil',
      route: `/${PATHS.fournisseur}/${PATHS.home}`
    },{
      ref: 'espace',
      title: 'Mon espace fournisseur',
      route: `/${PATHS.fournisseur}/${PATHS.monEspace}`
    }, {
      ref: 'catalogue',
      title: 'Mon catalogue',
      route: `/${PATHS.fournisseur}/${PATHS.monCatalogue}`
    }, {
      ref: 'eurochef',
      title: 'Catalogue Eurochef',
      route: `/${PATHS.fournisseur}/${PATHS.monEurochef}`
    },
  ]

  override openBurger() {
    this.dialog.open(FourBurgerComponent);
  }
}
