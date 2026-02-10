import { CodepostalDto } from "./codepostal-dto";

export class VilleDto {
    id: string;
    nom: string;
    locale: any;
    mapnoms: Map<any, string>;
    commentaire: Map<any, string>;
    publishDate: Date;
    lastUpdatedDate: Date;
    lastUpdateUserId: string;
    paysid: string;
    codepostal: CodepostalDto = new CodepostalDto();

    constructor(){}
}
