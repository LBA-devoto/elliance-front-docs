import { SiteEnable } from "./site-enable";

export class Actualite {
    id: string;
    titre: string;
    lienExtern: string;
    content: any;
    statut: string;
    siteEnables: SiteEnable[]=[{nom: 'Extranet Fournisseur ', enabled: false},{nom: 'Extranet Associé', enabled: false}];
    image: any;

    constructor(){}

}
