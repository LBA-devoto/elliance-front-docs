import { Table } from "./Table"

  export class PageElement {
    id: string
    name: string
    componentType: string
    visible: boolean
    data?: string
    heading?: boolean
    style?: Style
    label?: string
    styleClass?: string
    labelClass?: string
    value?: string
    radioOptionList?: RadioOptionList[]
    disabled?: boolean
    placeholder?: string
    rows?: number
    tab?:Table
  }
  
  export class Style {
    color: string
    "font-style": string
  }
  
  export class RadioOptionList {
    key: string
    value: string
  }