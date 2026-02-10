import { Parametre } from './parametre';
import { Layout } from './layout';

export class Template {
    id: string;
    entite: string;
    titre: string;
    action: string;
    
    
    nombrecolonne: number;
    colonnedroite: Parametre[]=[]
    colonnegauche: Parametre[]=[];

    layout: Layout;
    parameters: Parametre[];

    constructor(){}
}
