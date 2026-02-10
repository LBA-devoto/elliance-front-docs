import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PATHS } from 'src/app/app-routing.module';
import { CategoryService } from 'src/app/shared/services/category.service';
import { BurgerComponent } from 'src/app/user/navs/header-user/burger/burger.component';

@Component({
  selector: 'app-four-burger',
  templateUrl: './four-burger.component.html',
  styleUrls: ['./four-burger.component.css']
})
export class FourBurgerComponent extends BurgerComponent {

  constructor(public override dialogRef: MatDialogRef<BurgerComponent>, public override router: Router, public override categoryService: CategoryService, @Inject(MAT_DIALOG_DATA) public override data: any) {
    super(dialogRef, router, categoryService, data)
  }


  override fillNavOptions() {
    this.navOptions = [
      {
        ref: 'accueil',
        title: 'Accueil',
        route: `/${PATHS.fournisseur}/${PATHS.home}`
      },
      {
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
    ];
  }
}
