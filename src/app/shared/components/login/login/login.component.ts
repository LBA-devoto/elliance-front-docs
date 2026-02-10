import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginService } from 'src/app/shared/services/login.service';
import { UserDetails } from 'src/app/shared/entities/user-details';
import { MatDialog } from '@angular/material/dialog';
import { ForgotPasswordComponent } from '../../forgot-password/forgot-password.component';
import { MsalService } from '@azure/msal-angular';
import { PATHS } from 'src/app/app-routing.module';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/admin/core/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  hide: boolean = true;
  username: string = '';
  password: string = '';
  token: any;
  inactiveAccount: boolean = false;
  emailNotRegistered: boolean = false;
  invalidLogin: boolean = false;
  successLogin: boolean = false;
  error: boolean = false;
  personne: any;
  message: string;
  userDetails: UserDetails = new UserDetails();
  remember: boolean = true;

  isIframe = false;
  loginDisplay = false;
  samlMetadata: any;
  env = environment;
  client: String = '-' + environment.client;

  get hasError() {
    return this.invalidLogin;
    // return this.invalidLogin || this.error
  }

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private loginService: LoginService,
    private MsalAuthService: MsalService,
    private jwtHelper: JwtHelperService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // this.httpService.getSamlMetadata().subscribe((res) => {
    //   this.samlMetadata = res;
    // });

    this.isIframe = window !== window.parent && !window.opener;
    this.redirectionIfAuth();
  }

  redirectionIfAuth() {
    if (localStorage.getItem('token') || sessionStorage.getItem('token')) {
      this.router.navigate([
        localStorage.getItem('access')?.toString().includes('admin')
          ? `${PATHS.admin}/0`
          : `${PATHS.home}`,
      ]);
    }
  }

  forgotten() {
    this.dialog.open(ForgotPasswordComponent);
  }

  login() {
    this.error = false;
    this.inactiveAccount = false;
    this.invalidLogin = false;

    this.loginService
      .authentification(this.username, this.password, this.remember)
      .subscribe(
        async (result) => {
          if (result.includes('Bad credentials')) {
            this.invalidLogin = true;
          } else if (result.includes('nacti')) {
            this.inactiveAccount = true;
          } else if (result.includes('Error')) {
            this.error = true;
          } else {
            const jwt = this.jwtHelper.decodeToken(result);
            this.userDetails = jwt;            
            let cgu = localStorage.getItem('cgu') == 'accepted';
            localStorage.clear();
            localStorage.setItem('role', this.userDetails.role);
            localStorage.setItem('userid', this.userDetails.userid);
            localStorage.setItem('name', this.userDetails.firstname);
            localStorage.setItem('surname', this.userDetails.lastname);
            localStorage.setItem('cgu', cgu ? 'accepted' : 'pending');
            localStorage.setItem('access', this.userDetails.adminAccess ? 'admin':'extranet');

            if (this.remember) {
              
              localStorage.setItem('token', result);
              
              
            } else {
              sessionStorage.setItem('token', result);
            }
            await this.userService.checkUserLogin();
            this.router.navigate([
              localStorage.getItem('access')?.toString().includes('admin')
                ? `${PATHS.admin}/0`
                : `${PATHS.home}`,
            ]);
          }
        },
        () => {
          this.error = true;
        }
      );
  }

  openMS() {
    this.MsalAuthService.loginPopup().subscribe({
      next: (result) => {
        // Dans result on a les informations de l'utilisateur Microsoft
        // Si c'est sa première connexion alors il faut créer un compte/profil à l'utilisateur
        // Si le compte existe déjà, il faut récupérer les mêmes infos que pour la fonction de login afin de stocker le login de GEOLANE et non pas utiliser le token fourni par Microsoft

        // this.router.navigate(['/admin']);
        this.loginService
          .verifySSOAuth(result.idToken)
          .subscribe((res: any) => {
            
            if (res.token != null) {
              const jwt = this.jwtHelper.decodeToken(res.token);
              this.userDetails = jwt;

              
              let cgu = localStorage.getItem('cgu') == 'accepted';

              localStorage.clear();
              localStorage.setItem('role', this.userDetails.role);
              localStorage.setItem('userid', this.userDetails.userid);
              localStorage.setItem('token', res.token);
              localStorage.setItem('name', this.userDetails.firstname);
              localStorage.setItem('surname', this.userDetails.lastname);
              localStorage.setItem('code', this.userDetails.sub);
              localStorage.setItem('cgu', cgu ? 'accepted' : 'pending');
              localStorage.setItem('access', this.userDetails.adminAccess ? 'admin':'extranet');


              this.router.navigate([
                localStorage.getItem('access')?.toString().includes('admin')
                  ? `${PATHS.admin}/0`
                  : `${PATHS.home}`,
              ]);
            } else {
              this.emailNotRegistered = true;
            }
          });
      },
      error: (error) => console.log(error) // we are going to write a logging service later to handle errors
    });
  }

  setLoginDisplay() {
    this.loginDisplay =
      this.MsalAuthService.instance.getAllAccounts().length > 0;
    
  }
}
