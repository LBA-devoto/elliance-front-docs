export class DynamicDocumentInfo {
    id: string;
    documentName: string;
    label: Map<string, string>;
    description: Map<string, string>;
    fields: DynamicDocumentFieldInfo[];
    tabField: string;
    lastModifiedUser: string;
    creationDate: Date;
    updatingDate: Date;

    constructor(
        id?: string,
        documentName?: string,
        label?: Map<string, string>,
        description?: Map<string, string>,
        fields?: DynamicDocumentFieldInfo[],
        tabField?: string,
        lastModifiedUser?: string,
        creationDate?: Date,
        updatingDate?: Date
    ) {
        if (id) this.id = id;
        if (documentName) this.documentName = documentName;
        if (label) this.label = label;
        if (description) this.description = description;
        if (fields) this.fields = fields;
        if (tabField) this.tabField = tabField;
        if (lastModifiedUser) this.lastModifiedUser = lastModifiedUser;
        if (creationDate) this.creationDate = creationDate;
        if (updatingDate) this.updatingDate = updatingDate;
    }
}

export class DynamicDocumentFieldInfo {
    id: string;
    name: string;
    label: Map<string, string> | Map<String, String>;
    description: Map<string, string>;
    type: DynamicDocumentFieldInfoType;
    documentLinkName: string;
    parameterLinkName: string;
    parameterLinkField: string;
    documentLinkFields: string[];
    documentLinkReferenceField: string;
    viewAvailable: boolean;
    maxLength: number;
    maxDecimalLength: number;
    isRequired: boolean;
    isVisible: boolean;
    isModifiable: boolean;
    isMultilingual: boolean;
    isAuditable: boolean;
    isInDefaultView: boolean;
    lastModifiedUser: string;
    creationDate: Date;
    updatingDate: Date;

    constructor(
        id: string,
        name: string,
        label: Map<string, string>,
        description: Map<string, string>,
        type: DynamicDocumentFieldInfoType,
        documentLinkName: string,
        parameterLinkName: string,
        parameterLinkField: string,
        documentLinkFields: string[],
        documentLinkReferenceField: string,
        viewAvailable: boolean,
        maxLength: number,
        maxDecimalLength: number,
        isRequired: boolean,
        isVisible: boolean,
        isModifiable: boolean,
        isMultilingual: boolean,
        isAuditable: boolean,
        lastModifiedUser: string,
        creationDate: Date,
        updatingDate: Date
    ) {
        this.id = id;
        this.name = name;
        this.label = label;
        this.description = description;
        this.type = type;
        this.documentLinkName = documentLinkName;
        this.parameterLinkName = parameterLinkName;
        this.parameterLinkField = parameterLinkField;
        this.documentLinkFields = documentLinkFields;
        this.documentLinkReferenceField = documentLinkReferenceField
        this.viewAvailable = viewAvailable;
        this.maxLength = maxLength;
        this.maxDecimalLength = maxDecimalLength;
        this.isRequired = isRequired;
        this.isVisible = isVisible;
        this.isModifiable = isModifiable;
        this.isMultilingual = isMultilingual;
        this.isAuditable = isAuditable;
        this.lastModifiedUser = lastModifiedUser;
        this.creationDate = creationDate;
        this.updatingDate = updatingDate;
    }
}

export enum DynamicDocumentFieldInfoType {
    ID = 'ID',
    TEXT = 'TEXT',
    NUMBER = 'NUMBER',
    BOOLEAN = 'BOOLEAN',
    DATE_TIME = 'DATE_TIME',
    FILE = 'FILE',
    DOCUMENT_LINK = 'DOCUMENT_LINK',
    DOCUMENT_LINKS = 'DOCUMENT_LINKS',
    PARAMETER_LINK = 'PARAMETER_LINK',
    PARAMETER_LINKS = 'PARAMETER_LINKS'
}

export enum ConditionType {
    CONTAINS = 'CONTAINS',
    NOT_CONTAINS = 'NOT_CONTAINS',
    EQUALS = 'EQUALS',
    NOT_EQUALS = 'NOT_EQUALS',
    STARTS_WITH = 'STARTS_WITH',
    ENDS_WITH = 'ENDS_WITH',
    LESS_THAN = 'LESS_THAN',
    LESS_THAN_OR_EQUALS = 'LESS_THAN_OR_EQUALS',
    GREATER_THAN = 'GREATER_THAN',
    GREATER_THAN_OR_EQUALS = 'GREATER_THAN_OR_EQUALS',
    BETWEEN = 'BETWEEN',
    IS_EMPTY = 'IS_EMPTY',
    IS_NOT_EMPTY = 'IS_NOT_EMPTY'
}

export interface DynamicDocumentRequest {
    collectionName: string;
    filters: Filter[];
    sorts: Map<string, string>;
    page: number;
    pageSize: number;
    locales: string[];
}

export interface Filter {
    fieldName: string;
    conditions: Condition[];
}

export interface Condition {
    type: ConditionType;
    value: any;
    minValue?: number;
    maxValue?: number;
}
