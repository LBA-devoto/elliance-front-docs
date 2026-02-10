import { Injectable } from '@angular/core';
import { HttpclientService } from './httpclientService';
import { Subject, map, takeUntil } from 'rxjs';
import {
  BackofficeRestrictions,
  ExtranetRestrictions,
  User,
} from 'src/app/shared/entities/authentication/user';
import { IDroit } from '../interfaces/IDroit';
import { IMenuItem } from '../interfaces/IMenu';
import { Router } from '@angular/router';
import { PATHS } from 'src/app/app-routing.module';
import { Personnephysique } from 'src/app/shared/entities/personnephysique';
import { Role } from 'src/app/shared/enums/user-roles';
import { ViewDto } from 'src/app/shared/entities/viewdto';
import { ViewService } from './viewservice';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private auth: boolean;
  private user: User;
  roles: any[] = [];
  private destroy$: Subject<void> = new Subject<void>();
  role: Role;
  private userUrl = 'user/';
  constructor(
    private httpService: HttpclientService,
    private router: Router,
    private viewservice: ViewService
  ) {}

  getAllUsers() {
    return this.httpService.getList(this.userUrl);
  }

  getFavourViews(entite: string) {
    let viewDto = new ViewDto();
    viewDto.entite = entite;
    viewDto.ownerid = localStorage.getItem('userid');
    return this.viewservice.getFavoriView(viewDto);
  }
  setFavourViews(viewFavoris: any[]) {
    this.user.viewfavoris = viewFavoris;
  }

  getCurrentUser(): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      if (this.user) {
        if (
          !this.user.adminAccess &&
          window.location.pathname.includes('admin')
        ) {
          this.router.navigate([PATHS.logout]);
        } else if (
          this.user.adminAccess &&
          window.location.pathname.includes('extranet')
        ) {
          this.router.navigate([PATHS.logout]);
        }
        resolve(this.user);
      } else {
        this.httpService
          .get(this.userUrl + localStorage.getItem('userid'))
          .subscribe({
            next: async (res) => {
              this.user = res;
              this.user.password = '';
              this.user.resetToken = undefined;

              localStorage.setItem(
                'access',
                this.user.adminAccess ? 'admin' : 'extranet'
              );

              await this.setUserDroits();

              resolve(this.user);
            },
            error: (err) => {
              reject(err);
            },
          });
      }
    });
  }

  async checkUserLogin(): Promise<void> {
    let token = localStorage.getItem('token');
    this.auth = !(token === '' || token == undefined);

    await this.getCurrentUser();
  }

  async setUserDroits(): Promise<void> {
    await this.retriveUserRole();
    await this.loadUserRestrictions(this.roles);

    // get roles
    // let roleUrl = `role/getroles/0/50`;
    // this.httpService.get(roleUrl).subscribe((data) => {
    //   //  console.log(data)
    //   roles = data.roles;
    //   roles = roles.filter((x) => this.user.roles?.includes(x.id));
    //   localStorage.setItem(
    //     'role',
    //     Array.from(roles.map((el) => el.nom)).toString()
    //   );

    //this.loadUserDroitsMenu(roles);

    // });
  }

  loadUserRestrictions(roles: any[]): Promise<void> {
    return this.loadExtranetRestrictions(roles);
  }

  loadExtranetRestrictions(roles: any[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let extranetRestrictions = new ExtranetRestrictions();
      let mapExtranetRestrictions = roles
        .filter((el) => el?.extranetRestrictions)
        .map((el) => el?.extranetRestrictions);

      mapExtranetRestrictions.forEach((el) => {
        extranetRestrictions.champs = Array.from(
          new Set(extranetRestrictions.champs.concat(el.champs))
        );
        extranetRestrictions.menu = Array.from(
          new Set(extranetRestrictions.menu?.concat(el.menu))
        );
        extranetRestrictions.fonctions = Array.from(
          new Set(extranetRestrictions.fonctions.concat(el.fonctions))
        );
      });

      this.concatUserExtranetRestrictions(extranetRestrictions);

      if (this.user?.personnePhysique && this.user?.personnePhysique[0]) {
        let ppId = this.user?.personnePhysique[0];
        this.httpService.get('personnephysique/' + ppId).subscribe({
          next: (res) => {
            this.user.personnePhysiqueObj = res;
            this.loadPersonneMoraleInUser(res);
            resolve();
          },
          error: (err) => {
            reject(err);
          },
        });
      } else {
        resolve();
      }
    });
  }

  loadBackofficeRestrictions(roles: any[]) {
    // let backofficeRestrictions = new BackofficeRestrictions();
    // let mapBackofficeRestrictions = roles
    //   .filter((el) => el.backofficeRestrictions)
    //   .map((el) => el.backofficeRestrictions);
    // mapBackofficeRestrictions.forEach((el) => {
    //   backofficeRestrictions.champs = Array.from(
    //     new Set(backofficeRestrictions.champs.concat(el.champs))
    //   );
    //   backofficeRestrictions.menu = Array.from(
    //     new Set(backofficeRestrictions.menu?.concat(el.menu))
    //   );
    //   backofficeRestrictions.droits = Array.from(
    //     new Set(backofficeRestrictions.menu?.concat(el.droits))
    //   );
    //   backofficeRestrictions.fonctions = Array.from(
    //     new Set(backofficeRestrictions.fonctions.concat(el.fonctions))
    //   );
    // });
    // this.concatUserBackofficeRestrictions(backofficeRestrictions);
  }

  loadPersonneMoraleInUser(res: Personnephysique) {
    if (res.personnemorale && res.personnemorale?.[0]) {
      let pmId = res.personnemorale?.[0];
      this.httpService
        .get('personnemorale/' + pmId)
        .pipe(
          map((res: any) => {
            this.user.personneMoraleObj = res;
            this.user.personneMorale = [pmId];
          })
        )
        .subscribe();
    }
  }

  concatUserExtranetRestrictions(restrictions: ExtranetRestrictions) {
    if (this.user.extranetRestrictions) {
      this.user.extranetRestrictions.champs = Array.from(
        new Set(
          this.user.extranetRestrictions.champs.concat(restrictions.champs)
        )
      );
      this.user.extranetRestrictions.menu = Array.from(
        new Set(this.user.extranetRestrictions.menu?.concat(restrictions.menu))
      );
      this.user.extranetRestrictions.fonctions = Array.from(
        new Set(
          this.user.extranetRestrictions.fonctions.concat(
            restrictions.fonctions
          )
        )
      );
    } else {
      this.user.extranetRestrictions = restrictions;
    }
  }

  // concatUserBackofficeRestrictions(restrictions: BackofficeRestrictions) {
  //   if (this.user.backofficeRestrictions) {
  //     this.user.backofficeRestrictions.champs = Array.from(
  //       new Set(
  //         this.user.backofficeRestrictions.champs.concat(restrictions.champs)
  //       )
  //     );
  //     this.user.backofficeRestrictions.menu = Array.from(
  //       new Set(this.user.backofficeRestrictions.menu?.concat(restrictions.menu))
  //     );
  //     // this.user.backofficeRestrictions.droits = Array.from(
  //     //   new Set(
  //     //     this.user.backofficeRestrictions.menu?.concat(restrictions.droits)
  //     //   )
  //     // );
  //     this.user.backofficeRestrictions.fonctions = Array.from(
  //       new Set(
  //         this.user.backofficeRestrictions.fonctions.concat(
  //           restrictions.fonctions
  //         )
  //       )
  //     );
  //   } else {
  //     this.user.backofficeRestrictions = restrictions;
  //   }
  // }

  loadUserDroitsMenu(roles: any[]) {
    let reqDroits = roles.map((el) => el.droits);
    let droits: IDroit[] = [];
    for (let i = 0; i < reqDroits[0]?.length; i++) {
      droits[i] = reqDroits[0][i];
      reqDroits.forEach((droit) => {
        if (droit[i]?.selected) droits[i].selected = droit[i].selected;
      });
    }
    this.user.droits = droits;

    let reqMenus = roles.map((el) => el.menu);

    let menus: IMenuItem[] = [];
    for (let i = 0; i < reqMenus[0]?.length; i++) {
      menus[i] = reqMenus[0][i];
      reqMenus?.forEach((menu) => {
        if (!menus[i].selected) {
          if (menu[i]?.selected) menus[i].selected = menu[i]?.selected;
        }

        menu[i]?.subItems?.forEach((subMenu: IMenuItem, j: number) => {
          if (!menus[i]?.subItems?.[j].selected && menus[i]?.subItems) {
            if (subMenu?.selected)
              menus[i].subItems[j].selected = subMenu?.selected;
          }
        });
      });
    }
    this.user.menu = menus;
  }

  isAuth() {
    return this.auth;
  }

  retriveUserRole(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let urlmenu = 'role/getbyname';
      let userRole = localStorage.getItem('role');
      if (userRole === null) {
        urlmenu = 'role/getbyname';
      } else {
        urlmenu = 'role/getbyname/' + userRole;
        urlmenu = urlmenu?.replace(/\[|\]/g, '');
      }
      this.httpService
        .get(urlmenu)
        .pipe(takeUntil(this.destroy$)) // Use takeUntil to automatically unsubscribe when the component is destroyed
        .subscribe({
          next: (res: any) => {
            this.role = res;

            this.roles.push(this.role);
            if (
              this.role !== null &&
              this.role.backofficeRestrictions !== null &&
              this.role.backofficeRestrictions.droits !== null
            ) {
              this.role.backofficeRestrictions.droits =
                this.role.backofficeRestrictions.droits;
              this.role.backofficeRestrictions.menu =
                this.role.backofficeRestrictions.menu;
              this.role.backofficeRestrictions.champs =
                this.role.backofficeRestrictions.champs;
            }

            resolve();
          },
          error: (err) => {
            reject(err);
          },
        });
    });
  }

  ngOnDestroy() {
    this.destroy$.next(); // Emit a signal to unsubscribe from observables
    this.destroy$.complete(); // Complete the subject
  }
  userHasRight(fonction: string, menu: any = ''): boolean {

    // fonction = Modification,* menu ) = Parametres techniques
   
    if (menu?.toLocaleLowerCase() === 'parametre') {
      menu = 'Parametres techniques';
    }
    // fonction = Modification,* menu ) = Parametres techniques
  
    if (menu?.toLocaleLowerCase() === 'planificateur de tâches') {
      menu = 'Planification des tâches';
    }
    if (menu?.toLocaleLowerCase() === 'categorie') {
      menu = 'Catégories';
    }
    if (menu?.toLocaleLowerCase() === 'picto' || menu === 'pictocatalogue') {
      menu = 'Pictos';
    }
    // this kind of menu name occors when we are in the variablelogistique page and we open the link between produit and variablelogistique
    if (
      menu?.toLocaleLowerCase() === 'produit' ||
      menu === 'variablelogistique'
    ) {
      menu = 'Produits';
    }
    if (menu?.toLocaleLowerCase() === 'fournisseur') {
      menu = 'Fournisseurs';
    } else if (menu?.toLocaleLowerCase() === 'paremetres techniques') {
      menu = 'Paramètres techniques';
    }

    let hasAccess = false;

    let droits = this.role?.backofficeRestrictions?.droits?.find(
      (x: any) =>
        x?.text?.trim().toLocaleLowerCase() === menu?.trim().toLocaleLowerCase()
    );

    if (
      droits &&
      droits.children &&
      droits.children.find(
        (x: any) =>
          x.text.trim()?.toLocaleLowerCase() ===
          fonction?.trim()?.toLocaleLowerCase()
      )?.selected === true
    ) {
      hasAccess = true;
    } else if (
      droits &&
      !droits.children &&
      droits?.text?.trim().toLocaleLowerCase() ===
        fonction.trim()?.toLocaleLowerCase() &&
      droits?.selected === true
    ) {
      hasAccess = true;
    }
    return hasAccess;
  }

  getBackendRestrictionsChamps(): string[] {
    return this.role.backofficeRestrictions?.champs
      .filter((x: any) => x?.split(':')[0]?.toLocaleLowerCase() === 'produit')
      .map((x: any) => x?.split(':')[1]?.trim());
  }

  userHasChampViewPermissionAccess(champ: any, entite: any): boolean {
    let userChamps = this.role.backofficeRestrictions?.champs?.find(
      (x: any) =>
        x?.split(':')[1]?.toLocaleLowerCase() === champ?.toLocaleLowerCase() &&
        x?.split(':')[0]?.toLocaleLowerCase() === entite?.toLocaleLowerCase()
    );
    if (
      champ?.toLocaleLowerCase() ===
        userChamps?.split(':')[1]?.toLocaleLowerCase() &&
      entite?.toLocaleLowerCase() ===
        userChamps?.split(':')[0]?.toLocaleLowerCase()
    ) {
      return true;
    } else {
      return false;
    }
  }
  userHasChampUpdatePermissionAccess(champ: any, entite: any): boolean {
    // I need to pass menu
    if (this.userHasChampViewPermissionAccess(champ, entite)) {
      return true;
    } else {
      return false;
    }
  }

  hasMenuAccess(menuRef: string): boolean {
    if (menuRef === 'Gestions des utilisateurs') {
      menuRef = 'Utilisateurs';
    }

    let hasAccess = false;

    if (this.role === undefined || this.role === null) {
      //await this.retriveUserRole();
    }

    if (this.role?.backofficeRestrictions) {
      this.role.backofficeRestrictions.menu?.forEach((restriction: any) => {
        if (restriction?.text === menuRef && restriction?.selected) {
          hasAccess = true;
        }

        if (restriction.children) {
          restriction.children.forEach((child: any) => {
            if (child?.text === menuRef && child?.selected) {
              hasAccess = true;
            }
          });
        }
      });
    }

    return hasAccess;
  }

  getMenuNameFromEntite(entiteName:string)
  {

    switch(entiteName.toLocaleLowerCase())
    {
      case "adaptationplaque":
        return "Adaptation pots/plaques"
    
        default:
         return undefined;

    }
  }
}
