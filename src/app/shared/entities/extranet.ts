export class ExtranetClient {
    client: string;
    extranet: Extranet[];
}


export class Extranet {
    ref: string;
    title: string;
    entite: string;
    elements: ExtranetElement[];
}


export class ExtranetElement {
    element: string;
    data: any;
    picto?: boolean
}
