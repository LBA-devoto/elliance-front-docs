import { types } from "util";
import { AddresseDto } from "./adresse-dto";
import { Civilite } from "./civilite";
import { Email } from "./email";
import { Faxe } from "./faxe";
import { Fonction } from "./fonction";
import { Personnemorale } from "./personnemorale";
import { Tel } from "./tel";
import { Type } from "./type";

export class Personnephysique {
    id : string;
    nom : string = "";
    prenom: string = "";
    username: string;
    nompays: string;
    emailaddress:string;
    nomscompose: string;
    datenaissance: Date;
    unitedelongueur: string;
    taille: string;
    unitedepoids: any;
    email : Email;
    genre: any;
    statut: string;
    civilite: Civilite;
    types   : Type[]=[];
    
     
    poids: number;
    code:string;
    typecontactid: string;
    typecontact: any;
    type: Type;
    typeid: string;
    faxes: Faxe[]=[];
    tels: Tel[]=[];
    emails: Email[]=[];
    addresses: AddresseDto [] = []; // a definir
    fonction : Fonction;

    codesincr: Map<string,string>;
    commentaire: Map<string, string>;
    dateajout: any;
    datepublication: any;
    lastupdateuserid: any;
    addedfields: Map<string, any>;
    tier: string;

    personnemorales: Personnemorale[]=[];
    personnemorale: string[]
    mappersonnesphysiques: Map<string,string>;
    mappersonnesmorales: Map<string,string>;

    incrnum: number;
    departement: any;
    notes:Map<string,string>;

    users: string[];

    constructor(){}

}
