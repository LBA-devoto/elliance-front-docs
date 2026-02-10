import { EntiteChamp } from './champ/entitechamp';

export class ViewDto {
  id: any;
  nom: string;
  entite: string;
  ownerid: any;
  usersids: any[];
  shared: boolean = false;
  Type: string;
  type: string;
  code: string;
  isfavori: boolean;

  champs: Map<any, any> = new Map();
  labels: Map<any, any> = new Map();
  allchamps: EntiteChamp[];
  noms: Map<string, string>;
  commentaire: Map<string, string>;
  publishDate: number;
  dateajout: number;
  isselected: boolean = false;
  lastupdateddate: number;
  lastUpdateUserId: string;
  addedfields: Map<string, any>;
  filter: any[];
  favori: boolean;

  constructor() {}
}
