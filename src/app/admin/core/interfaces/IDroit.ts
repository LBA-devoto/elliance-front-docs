export class IDroit {
  icon: string;
  apply: string;
  entityName: string;
  filter: string;
  is_custom_icon: boolean;
  routerLink?: string;
  id: string;
  parentId: string;
  listedechamps: string[];
  title: string;
  text: string;
  nom: string = '';
  typeName: string;
  droitTitle: any = '';
  selected: boolean = false;
  filresappliques: {};
  expandable: boolean;

  children: IDroit[];
  subItems: IDroit[];
}
