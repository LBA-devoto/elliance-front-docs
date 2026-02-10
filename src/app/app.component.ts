import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CguPopupComponent } from './shared/components/cgu-popup/cgu-popup.component';
import { environment } from 'src/environments/environment';
import { UserService } from './admin/core/services/user.service';
import { AutologoutService } from './shared/services/autologout.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Elliance-Eurochef-Devichef';
  cguAccepted = localStorage.getItem('cgu') == 'accepted';
  client: String = environment.client;
  // logged = this.authGuard.canActivate(
  //   PATHS.home as any,
  //   this.router.routerState.snapshot
  // );

  constructor(
    private dialog: MatDialog,
    private userService: UserService,
    private autoLogout: AutologoutService
  ) {
    this.cguAccepted = localStorage.getItem('cgu') == 'accepted';
    if (!this.cguAccepted) {
      this.displayCGUPopUp();
    }
  }

  async ngOnInit(): Promise<void> {
    await this.userService.checkUserLogin();
    this.autoLogout.initInterval();
  }

  displayCGUPopUp() {
    if (!this.cguAccepted) {
      if (environment.client === 'eurochef') {
        this.dialog
          .open(CguPopupComponent, { hasBackdrop: true })
          .afterClosed()
          .subscribe(() => {
            this.cguAccepted = localStorage.getItem('cgu') == 'accepted';
          });
      }
    }
  }
}
