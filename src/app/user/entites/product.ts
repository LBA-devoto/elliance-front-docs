import { Categorie } from "src/app/shared/entities/categorie";

export class Product {
    accessoires: Accessory[];
    addedFields: any;
    alimentation: "ELECTRIQUE" | "GAZ" | string;
    caracteristique1: string;
    caracteristique2: string;
    caracteristique3: string;
    categories: Categorie[];
    cheminfer: any;
    classification: any;
    code: any;
    codebarreean: string;
    codeoeuvre: any;
    codeproduit: any;
    commentaire: any;
    couleurPivot: any;
    dateDebutVie: Date;
    dateFinVie: Date;
    dateProduction: Date;
    datedebutpromo: Date;
    datefinpromo: Date;
    description: string;
    descriptioncourte: string;
    descriptionlongue: string;
    designationrapide: string;
    devise: string;
    documents: any;
    ecatvisible: any;
    ecoparticipation: number;
    existEnBio: any
    famille: any;
    fichecommerciale: any;
    fiches: any;
    formuleid: any;
    formules: any;
    fournisseur: string;
    gabaritname: any;
    hasgabarit: any;
    hauteur: number;
    id: string;
    images: any;
    largeur: number;
    lastUpdateUserId: any;
    lastUpdatedDate: any;
    locale: any;
    longueur: number;
    mapdescription: Map<any, any>;
    mapdescriptioncourte: Map<any, any>;
    mapdescriptionlongue: Map<any, any>;
    mapnoms: Map<any, any>;
    maptitre: Map<any, any>;
    marque: string;
    matierePrincipale: any;
    nom: string;
    nomencalture: any;
    numPageCatalogue: number;
    options: any;
    pere: any;
    photonoiretblanc: any;
    photos: any;
    poidsnet: number;
    prix: number;
    prixachat: number;
    prixpromo: number;
    prixpublique: number;
    profondeur: number;
    promo
        :
        null
    promotion
        :
        null
    publication
        :
        null
    publishDate
        :
        null
    puissanceenwatt
        :
        100
    reference: string;
    reffournisseur: string;
    refinterne: string;
    regroupement: any;
    related: any;
    sav: any;
    segment: any;
    serialise: any;
    statut: 'Pubilié' | any;
    superFamille: any;
    tarifdatederniermiseajour: any;
    tauxremise1: number;
    tauxremise2: number;
    tauxremise3: number;
    text1: string;
    text2: string;
    text3: string;
    titre: string;
    tva: number;
    type: any;
    typeArticle: any;
    typeCateg: any;
    typeProduction: any;
    typeProduit: any;
    typeid: any;
    uniteMesureGamme: any;
    uniteachat: any;
    unitedepoids: any;
    unitedimension: any;
    uniteprix: any;
    validation:any
}



export class Accessory extends Product {
    constructor() {
        super()
    }
}

export class Option extends Product {
    constructor() {
        super()
    }
}


// export class Produit {
//     id: string;
//     nom: string;
//     titre: string;
//     reference: string;
//     formuleid: string;
//     descriptioncourteom: string;
//     descriptionlongue: string;
//     locale: string;
//     maptitre: any;
//     mapnoms: any;
//     code: string;
//     mapdescription: any;
//     mapdescriptioncourte: any;
//     mapdescriptionlongue: any;
//     codeoeuvre: string;
//     pere: string;
//     type: string;
//     typeid: string;
//     images: string[];
//     validation: string;
//     formules: string;
//     prix: Price[];
//     unitedepoids: string;
//     poidsnet: number;
//     unitedimension: string;
//     hauteur: number;
//     largeur: number;
//     longueur: number;
//     profondeur: number;
//     photonoiretblanc: any;
//     cheminfer: any;
//     codebarreean: string;
//     remises: any;
//     designationrapide: string;
//     tauxtva: number;
//     commentaire: string;
//     publishDate: Date;
//     lastUpdatedDate: Date;
//     lastUpdateUserId: string;
//     hasgabarit: boolean;
//     gabaritname: any;
//     marque: string;
//     reffournisseur: string;
//     refinterne: string;
//     tarifdatederniermiseajour: any;
//     documents: any;
//     related: any;
//     ecoparticipation: number;
//     prixdachat: number;
//     prixachat: number;
//     sav: any;
//     alimelecgaz: any;
//     puissanceenwatt: number;
//     classification: any;
//     uniteachat: number;
//     unitedeprix: number;
//     caracteristique: any;
//     photos: any;
//     fiches: any;
//     promo: any;
//     nomenclature: any;
//     ecatvisible: boolean;
// }

// class Price {
//     id: string;
//     nom: string;
//     locale: string;
//     mapnoms: string;
//     valeur: number;
//     monnaie: string;
//     code: string;
//     datedebut: Date;
//     datefin: Date;
//     commentaire: string;
//     publishDate: Date;
//     lastUpdatedDate: Date;
//     lastUpdateUserId: string;
//     addedfields: string;
// }