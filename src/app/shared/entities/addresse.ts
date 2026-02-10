import { VilleDto } from "./ville-dto";

export class Addresse {
    id : string;
   // adresseligne: Map<string,string>;
    adresseligne: any[]=[];
    ville: VilleDto;
    codepostal: any;
    commentaire: Map<any,string>;
    publishDate: Date;
    lastUpdatedDate: Date;
    lastUpdateUserId: string;

    constructor(){}
}
