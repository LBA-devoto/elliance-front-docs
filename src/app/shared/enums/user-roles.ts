import { BackofficeRestrictions } from "../entities/authentication/user";

export class Role {
  id: string;
  name: string;
  nom: string;
  menu: any;
  droits: any;
  users: any[] = [];
  extranetRestrictions: any;
  backofficeRestrictions: BackofficeRestrictions = new BackofficeRestrictions();
  commentaire: any;
  dateajout?: number;
  datepublication?: number;
  dernieremiseajour: string;
  lastUpdateUserId: any;
  description: any;
  statut: string;
  entities: any;
  selected: boolean;
  roles: any;
}
