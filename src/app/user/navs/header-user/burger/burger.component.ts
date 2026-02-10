import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PATHS } from 'src/app/app-routing.module';
import { NavOption } from '../header-user.component';
import { CategoryService } from 'src/app/shared/services/category.service';
import { SousMenu } from 'src/app/user/entites/sous-menu';
import { Categorie } from 'src/app/shared/entities/categorie';

@Component({
  selector: 'app-burger',
  templateUrl: './burger.component.html',
  styleUrls: ['./burger.component.css']
})
export class BurgerComponent implements OnInit {
  navOptions: NavOption[] = [];
  displaySubMenu = false;
  displayGestionSubMenu = false;
  sousMenu: SousMenu[] = [];
  defaultIcon = '/assets/images/Pas-dimage-disponible.jpg';

  constructor(public dialogRef: MatDialogRef<BurgerComponent>, public router: Router, public categoryService: CategoryService, @Inject(MAT_DIALOG_DATA) public data: any) { // Dans l'instance data est présent le sous-menu des catégories
    this.dialogRef.updateSize('100vw', '100vh');
    this.dialogRef.updatePosition({top: '0', left: '0'});
    this.dialogRef.addPanelClass('no-radius')
  }

  ngOnInit(): void {
    this.fillNavOptions();
  }

  fillNavOptions() {
    this.navOptions = this.data;
  }

  close() {
    this.dialogRef.close()
  }

  openMenu() {
    this.displaySubMenu = !this.displaySubMenu;
  }

  openGestionMenu() {
    this.displayGestionSubMenu = !this.displayGestionSubMenu;
  }

  goTo(cat: string) {
    this.router.navigate([PATHS.catalogues, cat]);
    this.dialogRef.close();
  }
  
  goToGestion(route?: string) {
    this.router.navigate([route]);
    this.dialogRef.close();
  }

  logo(cat: Categorie) {
    return this.sousMenu.find(el => el.titre == cat.titre.replace('/','-')) ? this.sousMenu.find(el => el.titre == cat.titre.replace('/','-'))?.logo : this.defaultIcon;
  }

}
