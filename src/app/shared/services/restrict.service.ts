import { Injectable } from '@angular/core';
import { UserService } from 'src/app/admin/core/services/user.service';
import { NavOption } from 'src/app/user/navs/header-user/header-user.component';

@Injectable({
  providedIn: 'root',
})
export class RestrictService {
  constructor(private userService: UserService) {}

  async restrictNavOptions(elements: NavOption[]) {
    let user: any = await this.userService.getCurrentUser();
    let restrictions = user.extranetRestrictions?.menu;
    if (restrictions) {
      let filtered = elements.filter((el) => !restrictions.includes(el.ref));
      filtered.forEach(async (el) => {
        if (el.subMenu) el.subMenu = await this.restrictNavOptions(el.subMenu);
      });
      return filtered;
    } else {
      return elements;
    }
  }
  getfonctions() {
    return [
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
  }
}
