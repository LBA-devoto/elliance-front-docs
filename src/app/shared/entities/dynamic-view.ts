export class DynamicViewInfo {
    id: string;
    viewName: string;
    label: Map<string, string>;
    description: Map<string, string>;
    documentName: string;
    documentFields: string[];
    documentFieldsLabel: string[];
    filters: Filter[];
    sorts: Map<string, string>;
    lastModifiedUser: string;
    creationDate: Date;
    updatingDate: Date;

    constructor(
        id?: string,
        viewName?: string,
        label?: Map<string, string>,
        description?: Map<string, string>,
        documentName?: string,
        documentFields?: string[],
        documentFieldsLabel?: string[],
        filters?: Filter[],
        sorts?: Map<string, string>,
        lastModifiedUser?: string,
        creationDate?: Date,
        updatingDate?: Date
    ) {
        if (id) this.id = id;
        if (viewName) this.viewName = viewName;
        if (label) this.label = label;
        if (description) this.description = description;
        if (documentName) this.documentName = documentName;
        if (documentFields) this.documentFields = documentFields;
        if (documentFieldsLabel) this.documentFieldsLabel = documentFieldsLabel;
        if (filters) this.filters = filters;
        if (sorts) this.sorts = sorts;
        if (lastModifiedUser) this.lastModifiedUser = lastModifiedUser;
        if (creationDate) this.creationDate = creationDate;
        if (updatingDate) this.updatingDate = updatingDate;
    }
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
