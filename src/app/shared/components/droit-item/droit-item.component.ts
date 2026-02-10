import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
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
  selector: 'app-droit-item',
  templateUrl: './droit-item.component.html',
  styleUrls: ['./droit-item.component.css'],
})
export class DroitItemComponent {
  @Input() treeFlatDataSource: MatTreeFlatDataSource<any, any>;
  @Input() treeControl: any;
  @Input() treeFlattener: any;
  @Output() selecteddroitChange = new EventEmitter<any[]>();
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

  update(node: any, selectValue: boolean): void {
    let parent: any = {
      text: node.name,
      selected: selectValue,
      children: [{ text: '', selected: false, children: [], parentId: '' }],
    };

    // Recursively select all children of a parent node
    if (node.expandable) {
      for (const child of this.treeControl.getDescendants(node)) {
        child.selected = selectValue;
        let childItem = {
          text: child.name,
          selected: selectValue,
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
      node.parentId = node.parentId.toLowerCase();
      node.name = node.name;

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
    this.selecteddroitChange.emit(this.treeFlatDataSource.data);
  }
}
