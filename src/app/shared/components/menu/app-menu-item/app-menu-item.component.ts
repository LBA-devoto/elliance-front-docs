import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { IMenuItem } from 'src/app/admin/core/interfaces/IMenu';

export class TreeItem {
  item: any;
  level: number;
  expandable: boolean;
  selected: boolean; // Add a property for selection
}

@Component({
  selector: 'app-menu-item',
  templateUrl: './app-menu-item.component.html',
  styleUrls: ['./app-menu-item.component.css'],
})
export class AppMenuItemComponent implements OnChanges {
  @Input() treeFlatDataSource: MatTreeFlatDataSource<any, any>;
  @Input() treeControl: any;
  @Input() treeFlattener: any;
  @Output() selectedCheckboxesChange = new EventEmitter<any[]>();
  @Input() editMode: boolean = false;
  // Emit an array of selected items
  result: any[] = [];

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['treeFlatDataSource']) {
      this.treeFlatDataSource = changes['treeFlatDataSource'].currentValue;
      this.result = this.treeFlatDataSource.data;
    }

    this.editMode = changes['editMode'].currentValue;
  }
  hasChild = (node: TreeItem) => node.expandable;

  // Call this method when a checkbox is selected or deselected
  onCheckboxChange(item: any): void {
    if (item.selected) {
      this.selectChildren(item);
    } else {
      this.deselectChildren(item);
    }
  }

  selectChildren(parentNode: any): void {
    this.update(parentNode, true);
  }

  deselectChildren(parentNode: any): void {
    this.update(parentNode, false);
  }

  // update(node: any, selectValue: boolean): void {
  //   let parent: any = { text: node.name, selected: selectValue, children: [] };

  //   // Recursively select all children of a parent node
  //   if (node.expandable) {
  //     for (const child of this.treeControl.getDescendants(node)) {
  //       child.selected = selectValue;
  //       let childItem = {
  //         text: child.name,
  //         selected: selectValue,
  //         children: [],
  //       };
  //       parent.children.push(childItem);
  //     }

  //     const index = this.result.findIndex((item) => item.text === parent.text);
  //     if (index !== -1) {
  //       this.result[index] = parent;
  //     }
  //   } else {
  //     this.result = this.result.map((parent) => {

  //       parent?.children?.map((child: any) => {
  //         if (child.text === node.name) {
  //           child.selected = selectValue;
  //         }
  //         return child;
  //       });
  //       parent.selected = selectValue;
  //       return parent;
  //     });
  //   }

  //   this.selectedCheckboxesChange.emit(this.result);
  // }
  update(node: any, selectValue: boolean): void {
    let parent: any = {
      text: node.name,
      selected: selectValue,
      icon: node.icon,
      is_custom_icon: node.is_custom_icon,
      parentId: node.parentId,
      children: [],
    };

    // Recursively selec  t all children of a parent node
    if (node.expandable) {
      for (const child of this.treeControl.getDescendants(node)) {
        child.selected = selectValue;
        let childItem = {
          text: child.name,
          selected: selectValue,
          icon: child.icon,
          is_custom_icon: child?.is_custom_icon,
          parentId: child.parentId,
          entityName: child.entityName,
          droitTitle: child.droitTitle, 
          typeName: child.typeName,
          listedechamps: child.listedechamps,
          filresappliques: child.filresappliques,
          children: [],
        };
        parent.children.push(childItem);

      }

      const index = this.treeFlatDataSource.data.findIndex(
        (item) => item.text === parent.text
      );
      if (index !== -1) {
        this.treeFlatDataSource.data[index] = parent;
      }
    } else {
      let parentNode = this.treeFlatDataSource.data.find((item) => {
        return item.text.toLowerCase() === node.parentId.toLowerCase();
      });

      // 'parentNode' will be either the matching item or 'undefined' if no match is found.
      if (parentNode) {
        parentNode.children.forEach((child: any) => {
          if (child.text === node.name) {
            child.selected = selectValue;
          }
        });

        let parentIndex = this.treeFlatDataSource.data.findIndex(
          (item) => item.text === parentNode.text
        );
        if (parentIndex !== -1)
          this.treeFlatDataSource.data[parentIndex] = parentNode;
      } else {
      }

      // return;
    }
    this.selectedCheckboxesChange.emit(this.treeFlatDataSource.data);
  }
}
