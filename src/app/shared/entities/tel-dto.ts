export class TelDto {
    id: string;
    libelle: string;
    numero: string;
    locale: any;
    maplibellenumero: Map<any, string>;
    commentaire: Map<any, string>;
    publishDate: Date;
    lastUpdatedDate: Date;
    lastUpdateUserId: string;

    constructor(){}
}
