import { DeleteReq } from './deleteReq';
import { ViewDto } from './viewdto';
import { Template } from './template';

export class Tables {
  deleteReq: DeleteReq = new DeleteReq();
  id: any;
  titre: string;
  reference: string;
  title: string;
  table: string;

  dialogName: string;
  viewdto: ViewDto = new ViewDto();
  entite: any;
  public active: boolean;
  public isTable: boolean;
  value: string;
  listedechamps: any[] = ['select', 'nom'];
  activeTable: string;
  view: ViewDto = new ViewDto();

  catalogTables: {[key:string]:string[]} = {};

  type: any;
  typeName: string;
  filterTypes: any;
  msg: any;
  isMenuVisible: boolean = true;
  isExtranet: boolean = false;
  filter: any;
  condition: { [key: string]: any } = {};
  champ: string;
  lecture: boolean;
  edition: boolean;
  champType: string;
  filresappliques: {};
  ids: string[] | null;
  totalElements: number = 0;
  locales: string[];
  template: Template;
  droitTitle: any = '';
  auditLogs: any[];
  constructor() {}
}
