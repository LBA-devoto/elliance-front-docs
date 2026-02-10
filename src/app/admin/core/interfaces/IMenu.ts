export class IMenuItem {
  icon: string = '';
  apply: string = '';
  entityName: string = '';
  filter: string = '';
  is_custom_icon: boolean = false;
  routerLink?: string = '';
  id: string = '';
  listedechamps: string[] = [];
  children: IMenuItem[] = [];
  subItems: IMenuItem[] = [];
  droitTitle: any = '';
  title: string = '';
  text: string = '';
  nom: string = '';
  parentId: string = '';
  typeName: string = '';
  selected: boolean = false;
  filresappliques: {} = {};
  expandable: boolean = false;
  level: number = 0;
}
// export class IMenuItem {
//   text: string;
//   title: string;
//   icon: string;
//   routerLink: string;
//   id: string;
//   entityName: string;
//   typeName: string;
//   apply: string;
//   selected: boolean = false;
//   listedechamps: string[];
//   subItems: IMenuItem[];
// }
