export class FormFieldConfig {
  id: string;
  label: string;
  name: string;
  value: any = {};
  elementdata: any = {};
  simpleMode = false;
  searchUrl: string;
  menu:string;
  searchableFields: any[] = [];
  type: string = 'text';
  checkboxOptions: any[] = [];
  visible: boolean = true;
  disabled: boolean = false;
  innerPropertyName: string;
  styleClass: string;
  idList: any[] = []; // liste des id
  entiteList: any[] = []; // liste des entites
  displayedColumns: any[] = [];
  parametreName: string;
  linkedEntite: string;
  taskName: any;
  dropdownList: any = [];
  checkBoxEntite: string;
  checkBoxLabelTitre: string;
  clickMethod: any;
  checkBoxValueTitre: string;
  entiteRelationProperte: any;
  isGauche = false;
  isAdroite = false;
  editMode: boolean = false;
  multilangueFields: any;
  locals: Map<string, any> = new Map<string, any>();
  images: any = {};
  uploadPath: string;
  uploadUrl: string;
  displayMode: string;
  displayProperty: string;
  isMultiLangue = false;
  labelLocal: any;
  singleImageMode = false;
  entiteClassSelection = false;
  entity: string;
  visibilityCheckProperte = '';
  visibilityCheckValue = '';
  typeName = '';
  imagesmap = {};
  filter: any;
  isList = false;
  languages: any[] = [];
  validationFields: any[] = [];
  isavalidationField = false;
  executing = false;

  constructor() {}
}
