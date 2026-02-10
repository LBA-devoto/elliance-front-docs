import { environment } from "src/environments/environment";

export class Routes {

    static fetchLocalResponse = (pageName: string) => `${environment.API_URL}/assets/mock-apis/${pageName}.json`;

    static fetchServerResponse = (pageName: string) => `${environment.API_URL}/assets/mock-apis/${pageName}`;
}