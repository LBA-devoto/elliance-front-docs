



export class DepartementDto {
    id: string;
    numero:any;
    titre: string;
    maplocaletitre: Map<any, string>;
    commentaire: Map<any, string>;
    publishDate: Date;
    lastUpdatedDate: Date;
    lastUpdateUserId: string;
    paysid: string;
    perenom: string;
    pereid: string;

    constructor(){}
}