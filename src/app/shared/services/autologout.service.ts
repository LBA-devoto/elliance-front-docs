import { Injectable, NgZone } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';
const MINUTES_UNITL_AUTO_LOGOUT = 15; // in Minutes
const CHECK_INTERVALL = 1000; // in ms
const STORE_KEY = 'lastAction';

@Injectable({
  providedIn: 'root',
})
export class AutologoutService {
  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.check();
    this.initListener();
    this.initInterval();
  }

  get lastAction() {
    const storedValue = localStorage.getItem(STORE_KEY);

    if (!storedValue) {
      return Date.now();
    }
    const parsedValue = parseInt(storedValue, 10);
    if (isNaN(parsedValue)) {
      // Handle the case where the stored value is not a valid integer
      return Date.now(); // Or any other default value or error handling mechanism
    }
    return parsedValue;
  }
  set lastAction(value) {
    localStorage.setItem(STORE_KEY, String(value));
  }

  initListener() {
    this.ngZone.runOutsideAngular(() => {
      document.body.addEventListener('click', () => this.reset());
    });
  }

  reset() {
    this.lastAction = Date.now();
  }

  initInterval() {
    this.ngZone.runOutsideAngular(() => {
      setInterval(() => {
        this.check();
      }, CHECK_INTERVALL);
    });
  }

    check() {
    const now = Date.now();
    const timeleft = this.lastAction + MINUTES_UNITL_AUTO_LOGOUT * 60 * 1000;
    const diff = timeleft - now;
    const isTimeout = diff < 0;

    this.ngZone.run(() => {
      if (isTimeout && this.auth.userValue) {
        this.auth.logout();
        this.router.navigate(['/login']);
      }
    });
  }
}
