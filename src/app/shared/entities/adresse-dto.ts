import { CodepostalDto } from "./codepostal-dto";
import { VilleDto } from "./ville-dto";

export class AddresseDto {
    id : string;
   // adresseligne: Map<string,string>;
    adresseligne: any[]=[];
    ville: VilleDto;
    codepostal: CodepostalDto;
    commentaire: Map<any,string>;
    publishDate: Date;
    lastUpdatedDate: Date;
    lastUpdateUserId: string;

    constructor(){

    }
}