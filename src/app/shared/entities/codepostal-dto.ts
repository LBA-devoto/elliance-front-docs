export class CodepostalDto {
    id: string;
    libelle: string;
    valeur: any;
    locale: any;
    mapvaleurlibelle: Map<any,string>;
    commentaire: Map<any,string>;
    publishDate: Date;
    lastUpdatedDate: Date;
    lastUpdateUserId: string;

    constructor(){}
}
