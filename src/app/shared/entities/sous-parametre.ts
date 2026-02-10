export class SousParametre {
    id: string;
    entity: string;
    label: string;
    valeur: string;
    type: string;
    map: any;
    champs: any;
    
    visible: boolean;
    className: string;
    request: string;
    parametres: SousParametre[]=[]
    objet: any;

    list: any[];

    file: File;
    fils: FileList;

    constructor(){}
}
