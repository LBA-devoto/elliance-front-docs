import { IDroit } from 'src/app/admin/core/interfaces/IDroit';
import { Fonction } from '../fonction';
import { Personnemorale } from '../personnemorale';
import { Personnephysique } from '../personnephysique';
import { Tel } from '../tel';
import { IMenuItem } from 'src/app/admin/core/interfaces/IMenu';

export class ExtranetRestrictions {
  menu: string[] = [];
  champs: string[] = [];
  fonctions: string[] = [];
}
export class BackofficeRestrictions {
  menu: IMenuItem[] = [];
  champs: any[] = [];
  fonctions: string[] = [];
  droits: IDroit[] = [];
}

export class User {
  filter(arg0: (x: any) => boolean): User {
    throw new Error('Method not implemented.');
  }
  numero: undefined;
  constructor() {}
  id: any;
  nom: string = '';
  prénom: string = '';
  username: string;
  role: string;
  token?: string;
  userdetails: Userdetails = new Userdetails();
  firstname: string;
  lastname: string;
  password: string;
  email: string;
  resetToken?: string;
  viewfavori: any;
  roles: any[] = [];
  droits: any[];
  extranetRestrictions: ExtranetRestrictions;
  backofficeRestrictions: BackofficeRestrictions = new BackofficeRestrictions();
  adminAccess: boolean;
  personnePhysique: string[];
  personnePhysiqueObj: Personnephysique;
  personneMorale: string[];
  personneMoraleObj: Personnemorale;
  menu: any[];
  viewfavoris: any[];
  userdomain: any;
  authorities: any[];
  statut: string;
  enabled: boolean;
  validated: boolean;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
  tels: Tel[] = [];
  fonction: Fonction = new Fonction();
}

export class Userdetails {
  sub: string;
  iss: string;
  active: boolean;
  typ: string;
  preferred_username: string;
  given_name: string;
  client_id: string;
  sid: string;
  acr: string;
  upn: string;
  realm_access: RealmAccess;
  azp: string;
  scope: string;
  name: string;
  exp: number;
  session_state: string;
  iat: number;
  family_name: string;
  jti: string;
  email: string;
  username: string;
  tels: Tel[] = [];
}

export class RealmAccess {
  roles: string[];
}
