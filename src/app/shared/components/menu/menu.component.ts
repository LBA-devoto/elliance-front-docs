import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MenuActions } from '../../enums/menu-actions';
import { PageOptions } from '../../enums/page-modes';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  @Input() pageMode = PageOptions.WAIT;
  @Output() MenuActions = new EventEmitter<MenuActions>();
  pageModes = PageOptions;
  menuActions = MenuActions;
  constructor() {}

  ngOnInit(): void {}

  ngOnchanges(changes: SimpleChanges) {
    if (changes['pageMode']) {
      this.pageMode = changes['pageMode'].currentValue;
    }
  }

  emitMenuAction(userAction: MenuActions) {
    this.MenuActions.emit(userAction);
  }
}
