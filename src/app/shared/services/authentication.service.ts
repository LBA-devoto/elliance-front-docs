import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpclientService } from 'src/app/admin/core/services/httpclientService';
import { User } from '../entities/authentication/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(private router: Router, private httpService: HttpclientService) {
    const userString = localStorage.getItem('user');
    const userObject =
      userString !== null ? JSON.parse(userString) : new User();
    this.userSubject = new BehaviorSubject<User>(userObject);
    this.user = this.userSubject.asObservable();
  }

  public get userValue() {
    return this.userSubject.value;
  }

  login(username: string, password: string) {
    this.httpService.authenticate(username, password).subscribe((user) => {
      if (user.token) {
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        this.router.navigate(['/admin']);
      }
    });
  }

   currentUser() {
    let token = localStorage.getItem('token');
    if (!token) return null;

    return new JwtHelperService().decodeToken(token);
  }

  logout() {
    localStorage.clear();
    sessionStorage.removeItem('token');

    // remove user from local storage to log user out
    // localStorage.removeItem('user');
    // this.userSubject.next(new User());
    // this.router.navigate(['/login']);
  }
}
