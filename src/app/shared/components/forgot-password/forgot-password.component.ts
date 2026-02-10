import {
  Component,
  HostListener,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginService } from 'src/app/shared/services/login.service';
import { UserDetails } from 'src/app/shared/entities/user-details';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  hide: boolean = true;
  validBtn: boolean = true;
  username: string = '';
  password: string = '';
  token: any;
  invalidLogin: boolean = false;
  inactiveAccount: boolean = false;
  successLogin: boolean = false;
  wellSent: boolean = false;
  error: boolean = false;
  personne: any;
  message: string;
  userDetails: UserDetails = new UserDetails();
  client: String = '-' + environment.client;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private jwtHelper: JwtHelperService
  ) {}

  ngOnInit(): void {}

  envoyer() {
    this.error = false;
    this.validBtn = false;
    this.invalidLogin = false;
    this.inactiveAccount = false;
    this.message = '';

    this.loginService.sendRecoveryLink(this.username).subscribe(
      (resp: any) => {
        this.invalidLogin = resp.responseCode.includes('06'); // user does not exist
        this.wellSent = resp.responseCode.includes('00');
        this.validBtn = true;
      },
      () => {
        this.error = true;
        this.validBtn = true;
      }
    );
  }
}
