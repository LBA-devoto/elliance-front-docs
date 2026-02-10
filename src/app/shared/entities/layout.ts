import { Tab } from './tab';
import { LayoutCondition } from './layoutCondition';

export class Layout {

    hasCondition: boolean = false;
    conditions: LayoutCondition[] = [];

    tabs: Tab[] = [];

    constructor() {}
}
