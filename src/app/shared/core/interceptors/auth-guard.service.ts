import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    if (localStorage.getItem('token') !== null) {
      let arr = route.url.map(el => el.path);
      if (arr.includes('admin')) { // URL ADMIN
        if (localStorage.getItem('access') != 'admin') {
          this.router.navigate(['/logout']);
          return false;
        }
      } else { // URL EXTRANET
        if (localStorage.getItem('access') != 'extranet') {
          this.router.navigate(['/logout']);
          return false;
        }
      }  

      // verify if user is authorized to access the route 
      return true;
    }
    this.router.navigate(['/logout']);
    return false;
    //throw new Error('Method not implemented.');
  }
}
