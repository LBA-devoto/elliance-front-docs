import { SousParametre } from './sous-parametre';

export class Parametre {
  id: string;
  entity: string;
  name: string;
  label: string;
  formfield: any;
  nombrecolonne: number;
  dropdownList: any[] = [];
  valeur: any;
  type: string;
  champs: any;
  visible: boolean;
  className: string;
  request: string;
  parametres: SousParametre[] = [];
  multiLangue: boolean;
  list: any[];
  file: File;
  fileList: FileList;

  constructor() {}
}
