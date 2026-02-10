import { Product } from "src/app/user/entites/product";
import { Image } from "./image";

export class Categorie {
    id: string;
    addedFields: any;
    code: string;
    dateajout: Date;
    datepublication: Date;
    depth: number;
    dernieremiseajour: Date | any;
    icone: string;
    images: any;
    imagesmap: Map<string, Image>;
    lastupdateuserid: string;
    mapdescriptioncourte: any = {};
    mapdescriptionlongue: any = {};
    maplocaletitre: any = {};
    mappaths: any;
    ordre: any;
    path: any;
    pere: any;
    perecode: string;
    pereid: string;
    produits: Product[];
    rootid: string;
    status: 'Publié' | string;
    texte1: string;
    texte2: string;
    texte3: string;
    titre: string;
    topcode: string;
    type: any;
    visible: any;

    constructor() { }
}
