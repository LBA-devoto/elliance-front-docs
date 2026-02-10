import { Prix } from "./prix";

export class Produit {
    id: string;
    nom: string;
    titre: string;
    reference: string;
    descriptioncourte: string;
    descriptionlongue: string;
    designationrapide: string;
    locale: any;
    maptitre: any;
    mapnoms: Map<any, string>;
    mapdescription: Map<any, string>;
    mapdescriptionlongue: any;
    code: string;
    codebarreean: string;
    hauteur: number;
    largeur: number;
    longueur: number;
    profondeur: number;
    description: string;
    photonoiretblanc: string;
    cheminfer: string;
    pere: ProductAspect;
    statut: any;
    modele: any;
    type: any;
    tauxtva: number;
    poidsnet: number;
    unitedimension: string;
    unitedepoids: string;
    images: any;
    imagesmap: Map<any, any>;
    url: string;

    prix: Prix[] = [];
    remises: Map<any, any>;
    classification: Map<any, any>;

    marque: string;
    reffournisseur: string;
    refinterne: any;
    ecoparticipation: any;
    prixdachat: any;
    prixachat: any;
    uniteachat: any;
    unitedeprix: any;
    puissanceenwatt: any;
    alimelecgaz: any;

    caracteristique: any[] = [];
    photos: any[] = [];
    fiches: any;
    promo: any;
    nomencalture: any[] = []
    related: any;
    ecatvisible: boolean;

    sav: any;

    commentaire: Map<any, string>;
    publishDate: Date;
    lastUpdatedDate: Date;
    lastUpdateUserId: string;

    dateProduction: Date;
    dateDebutVie: Date;
    dateFinVie: Date;
    datedebutpromo: Date;
    datefinpromo: Date;
    decor: ProductAspect;
    depilageMachine: ProductAspect;

    accessoires: any;
    options: any;
    accroche: any;
    addedFields: any;
    alimentation: string;
    argumentVente: any;
    aspect: ProductAspect;
    cachePot: ProductAspect;
    caracteristique1: any;
    caracteristique2: any;
    caracteristique3: any;
    categories: any[];
    claySurface: number;
    codeoeuvre: any;
    codeproduit: any;
    colleretteHauteur: any;
    colleretteLargeur: any;
    colleretteType: ProductAspect;
    colorama: ProductAspect;
    couleur: ProductAspect;
    couleurPivot: ProductAspect;
    creves: ProductAspect;
    crevesForme: ProductAspect;
    crevesDiametre: number;
    crevesLargeur: number;
    crevesLongueur: number;
    crevesNb: number;

    descriptionrapide: any;
    devise: any;
    diametreAlveole: number;
    diametreExterieur: number;
    diametreFondPot1: number;
    diametreFondPot2: number;
    diametreInferieur: number;
    diametreInterieur: number;
    diametreNiveau2: number;
    diametreNiveau3: number;
    diametreSuperieur: number;
    documents: any;
    epaisseur: any;
    epaulementAdaptabilite: ProductAspect;
    epaulementType: ProductAspect;
    epaulementLargeur: any;
    existEnBio: ProductAspect;
    famille: ProductAspect;
    fichecommerciale: any;
    forme: ProductAspect;
    formeAlveole: ProductAspect;
    formuleid: any;
    formules: any;
    fournisseur: any;
    gabaritname: any;
    geometrie: ProductAspect;
    geometriefond: ProductAspect;
    hasgabarit: boolean;
    hauteurAlveole: number;
    hauteurEmpilage: number;
    hauteurFond: number;
    hauteurPied: number;
    largeurAlveole: number;

    longueurAlveole: number;
    mapLocalConseilStock: any;
    mapLocalDecorDescription: any;
    mapLocalGravure: any
    mapLocalInformationsTechniques: any;
    matiere: ProductAspect;
    matierePrincipale: ProductAspect;
    modeEmpilage: ProductAspect;

    nbAlveole: number;
    nbEchantillon: number;
    nbMoules: number;
    nbPotBois: number;
    nbPotCc: number;
    nbProduitCc: number;
    nbProduitLigne: number;
    nbProduitQuinconce: number;
    nbTrous: number;
    nbTrousFondPot1: number;
    nbTrousFondPot2: number;
    nbTrousNiveau2: number;
    nbTrousNiveau3: number;
    nbTrousTotal: number;

    nervuresRenfort: ProductAspect;
    nomenclature: any;
    nouveaute: ProductAspect;
    numDossier: any;
    numMoules: any;
    numPageCatalogue: any;
    orientationEmpilage: ProductAspect;
    pente: any;
    plaqueDrainage: ProductAspect;
    positionPattesEmpilage: ProductAspect;

    promotion: any;
    prixpromo: number;
    prixpublique: number;

    prix1: number;
    prix2: number;
    prix3: number;
    prix4: number;

    produits: string[];

    publication: ProductAspect;
    referenceFournisseur: any;
    regroupement: ProductAspect;
    reserveEau: ProductAspect;
    segment: ProductAspect;
    serialise: any;
    serrageMaximum: number;
    stockage: ProductAspect;
    superFamille: ProductAspect;
    surfaceDrainage: number;
    tarifdatederniermiseajour: any;
    tauxremise1: number;
    tauxremise2: number;
    tauxremise3: number;
    text1: any;
    text2: any;
    text3: any;
    tranche1: ProductAspect;
    tranche2: ProductAspect;
    tranche3: ProductAspect;
    tranche4: ProductAspect;
    trousAjoureDiametre: number;
    trousAjoureNb: number;
    trousPleinDiametre: number;
    trousPleinNb: number;
    tva: number;

    uniteMesureGamme: ProductAspect;
    uniteTarifaire: ProductAspect;
    uniteprix: number;


    typeArticle: ProductAspect;
    typeCateg: ProductAspect;
    typeProduction: ProductAspect;
    typeProduit: ProductAspect;
    typeStructure: ProductAspect;
    typefond: ProductAspect;
    typeid: any;

    validation: ProductAspect;
    volume: number;
    volumeAlveole: number;

    constructor() { }
}

class ProductAspect {
    id: any;
    images: any;
    mapLocalLebelle: any;
    nomTable: any;
    valeur: any;
    valeurNumerique: any;
}
