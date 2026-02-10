import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AlertService } from '../../services/alert-service';
import { LoginService } from '../../services/login.service';
import { ConfirmDialogData } from '../dialogs/dialog-data';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-retrieve-password',
  templateUrl: './retrieve-password.component.html',
  styleUrls: ['./retrieve-password.component.css'],
})
export class RetrievePasswordComponent implements OnInit {
  loaded: boolean;
  error: boolean = false;
  token: string = '';
  hide: boolean = true;
  regex: RegExp =
    // /^(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z0-9!@#$%^&*(),.?":{'}|<>_-]{8,}$/;
    /^(?=.*[0-9])(?=.*[}+\-_*&$#@!^()[\]{}\\|;:'",.<>/?`~éàè€£ù²§°])(?!.*[ \t\r\n\v\f])(?=.*[a-zA-Z])[a-zA-Z0-9}{+\-_*&$#@!^()[\]{}\\|;:'",.<>/?`~éàè€£ù²§°]{8,}$/;

  validators = [
    Validators.required,
    Validators.minLength(8),
    Validators.pattern(this.regex),
  ];

  form: FormGroup;
  outPassword = false;
  outConfirm = false;
  env = environment;
  client: String = '-' + environment.client;
  responseMessage: string;

  get passwordMatch() {
    return (
      this.form.get('password')?.value ==
      this.form.get('confirmPassword')?.value
    );
  }

  get validPassword() {
    return !this.outPassword || this.form.get('password')?.valid;
  }

  constructor(
    private loginService: LoginService,
    private router: Router,
    private alertService: AlertService
  ) {
    this.form = new FormGroup({
      password: new FormControl('', this.validators),
      confirmPassword: new FormControl('', this.validators),
    });
  }

  ngOnInit(): void {
    this.verifyToken();
  }

  backLogin() {
    this.router.navigate(['/login']);
  }

  verifyToken() {
    let path = window.location.href.split('=');
    let token = path[path.length - 1];

    this.loginService.verifyPasswordResetToken(token).subscribe(
      (res: any) => {
        if (res.response.includes('The link has already been used.')) {
          this.responseMessage = 'Le lien a déjà été utilisé.';
        } else if (
          res.response.includes(
            "Une erreur s'est produite lors de la réinitialisation du mot de passe, veuillez contacter l'administrateur"
          ) ||
          res.response.includes('the link is no longer valid')
        ) {
          this.responseMessage = "Le lien n'est plus valide.";
        } else {
          this.loaded = true;
          this.token = res.token;
        }
      },
      (err) => {
        this.error = true;
      }
    );
  }

  changePassword() {
    this.loginService
      .changePassword(this.token, this.form.get('password')?.value)
      .subscribe((res: any) => {
        //
        let dialog: ConfirmDialogData = {
          title: 'Modification de mot de passe',
          message: 'Votre mot de passe est bien modifié',
          cancelText: ``,
          confirmText: ``,
        };
        if (res.response.includes('successful')) {
          this.alertService.confirmDialog(dialog).subscribe(() => {
            this.router.navigate(['/']).then(() => {
              window.location.reload();
            });
          });
        } else {
          dialog.message = 'Erreur lors de la modification, veuillez réessayer';
          this.alertService.confirmDialog(dialog).subscribe();
        }
      });
  }
}
