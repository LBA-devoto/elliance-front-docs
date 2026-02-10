import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  @ViewChild('sidenav') sidenav: MatSidenav;
  isExpaned = true;
  showSubmenu: boolean = false;
  isShowing = false;
  showSubSubmenu: boolean = false;

  home: boolean = false;

  items: number[]=[1,2,3,4,5,6,7,8,9,10]

  constructor() { }

  ngOnInit(): void {
  }

}
