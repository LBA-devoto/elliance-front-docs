export class EmailDto {
    id : string;
    mailfrom :string;
    mailto:string;
    mailcc: string;
    senddate: Date;
    mailbcc: string;
    mailsubject: string;
    mailcontent :string;
    contenttype: string;
    attachments : any [] =[];
    libelle: string;
    valeur: any;
    locale: any;
    contratid: string;
    mapvaleurlibelle: Map<any, string>;
    commentaire: Map<any, string>;
    dateajout : any;
    datepublication: any;
    dernieremiseajour: any;
    lastUpdatedDate: Date;
    lastUpdateuserid: string;
  commandeid: string;

    constructor(){}
}
