export class Champs {

    id :string;
	nom : string;
	entite : string;
	entiteid : string;
	type : string;
	precision : string;
	modificateur : string;
	noms : Map<string,string>;
	commentaire: Map<string,string>;
    publishDate :number;;
    dateajout : number;
	lastupdateddate : number;
    lastUpdateUserId : number;
	addedfields: Map<string,any>;	

    constructor(){}
}
