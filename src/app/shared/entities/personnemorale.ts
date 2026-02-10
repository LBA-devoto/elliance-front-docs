import { Addresse } from './addresse';
import { AddresseDto } from './adresse-dto';
import { CodepostalDto } from './codepostal-dto';
import { Email } from './email';
import { Faxe } from './faxe';
import { Personnephysique } from './personnephysique';
import { Tel } from './tel';
import { Type } from './type';

export class Personnemorale {
  id: string;
  externalid: any;
  nom: string;
  complémentaires: any;
  surnom: any;
  code: string;

  tels: Tel[] = [];
  faxes: Faxe[] = [];
  emails: Email[] = [];
  addresses: AddresseDto[] = [];
  fonction: any;
  type: Type;
  typeid: string;
  raisonsociale: string;
  enseigne: any;
  tva: string;
  prospect: any;
  capital: any;
  nompays: string;
  codefour: any;
  statut: string;
  statutid: any;
  mappersonnesphysiques: Mappersonnesphysiques;
  mappersonnesmorales: Mappersonnesmorales;
  nombredenaissance: any;
  datedebutcontrat: any;
  datefincontrat: any;
  contact: any;
  statutpp: string;
  siret: string;
  commentaire: any;
  personnephysiquemap: any;
  personnemoralemap: Personnemoralemap;
  personnemorales: Personnemorale[];
  tiers: any;
  personnephysiquesid: any;
  personnephysiques: Personnephysique[];
  dateajout: number;
  datepublication: number;
  dernieremiseajour: number;
  lastupdateuserid: any;
  personnemoralestatut: any;
  siteweb: string;
  personnemoraletype: any;
  villes: any;
  codepostal: any;
  errors: any;
  codeclient:any;
  codefournisseur:any;
  codecomptable: any;
  codecomptableclient: any;
 
  codecomptablefournisseur: any;
  departement: any;
  effectif: any;
  typeentiteLegale: any;
  siren: any;
  nafape: any;
  rcsrm: any;
  notes: Notes3;
  listedechamps:string[] = [
    'select',
    'nom',
    'code',
    'raisonsociale',
    'tva',
    'statut',
    'nompays'
  ];
  assujettialatva: any;
  logistique: Logistique2;
  info: any;
  codes: any;
  photos: any;

  constructor() {}
}

export class Mappersonnesphysiques {}

export class Mappersonnesmorales {}

export class Personnemoralemap {
  ASSOCIE: string[];
  CLIENT: string[];
}

export interface Notes2 {}

export interface Mappersonnesphysiques3 {}

export interface Mappersonnesmorales3 {}

export interface Notes3 {
  prive: any;
  public: any;
}

export class Logistique2 {
  logistique1: any = '';
}
