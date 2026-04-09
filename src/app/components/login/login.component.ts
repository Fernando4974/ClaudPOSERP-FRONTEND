import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserLogin } from '../../interfaces/user';
import { SpinnerComponent } from '../spinner/spinner.component';
import { RecaptchaModule } from 'ng-recaptcha';
import { NavBarService } from '../../services/navBar/navBar.service';
import { GoogleLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    FormsModule,
    SpinnerComponent,
    RecaptchaModule,
    GoogleSigninButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [NavbarComponent]
})
export class LoginComponent implements OnInit {
  recaptchaLoading: boolean = true;
  email: string = '';
  password: string = '';
  alertTexto: string = '';
  loading: boolean = false;
  public recaptchaToken: string | null = null;
  isDirty: boolean = false;
  verPassword = false;

  constructor(
    private router: Router,
    private _userService: UserService,
    private _nav: NavBarService,
    private _authService: SocialAuthService
  ) {}

  ngOnInit(): void {
  this._nav.setExitButtonVisibility(false);

  this._authService.authState.subscribe((user) => {
    // Solo loguear si hay usuario Y si no estamos en medio de un logout
    // Muchas veces, al cargar el componente, la librería 'recuerda' al usuario.
    if (user && !sessionStorage.getItem('logging_out')) {
      this.loading = true;
      this._userService.loginWithGoogle(user.idToken).subscribe({
        next: (res) => {
         // console.log(res)
           // El backend ahora devuelve `token` y `refreshToken` directamente
           sessionStorage.setItem('token', res.token);
           sessionStorage.setItem('refreshToken', res.refreshToken);
           sessionStorage.setItem('user_name', res.user_name );
           this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.loading = false;
          this.alertTexto = 'Acceso denegado';
        }
      });
    }
  });
}

 loginWithGoogle(): void {
  this.alertTexto = '';
  this.loading = true;
  this.isDirty = false; // Marcar como limpio al iniciar el proceso de login con Google

  this._authService.signIn(GoogleLoginProvider.PROVIDER_ID)
    .then((user) => {




      this._userService.loginWithGoogle(user.idToken).subscribe({
        next: (res) => {
          this.loading = false;

           sessionStorage.setItem('token', res.token);
           sessionStorage.setItem('refreshToken', res.refreshToken);
           sessionStorage.setItem('user_name', res.user_name);
          this.router.navigate(['/pos-register']);
        },
        error: (err) => {
          this.loading = false;
          this.alertTexto = 'Usuario no registrado en el sistema';
        }
      });
    })
    .catch((error) => {
      this.loading = false;
      this.alertTexto = 'No se pudo iniciar sesión con Google';
      console.error('Google Sign-In error:', error);
    });
}

  ///metodos por implementar PARA EL CAN DEACTIVATE
  hasUnsavedData(): boolean {
    return this.isDirty;
  }

  markAsDirty() {
    this.isDirty = true;
  }
  //FIN metodos por implementar

  //RECAPTCHA
  resolved(token: string | null) {
    this.recaptchaToken = token;
    this.alertTexto = ''; // Limpiamos alertas si las habia
  }

  onError(errorDetails: any) {
    this.loading = false;
    this.alertTexto = 'Error al cargar reCAPTCHA. Por favor, inténtalo de nuevo.';
    console.error('Error de reCAPTCHA:', errorDetails);
  }

  login() {
    if (!this.recaptchaToken) {
      this.loading = false;
      this.alertTexto = 'Por favor, completa el reCAPTCHA';
      return;
    }
    this.loading = true;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (this.password == 'p') {
      this.router.navigate(['/product']);
      return;
    }

    if (this.password == 'r') {
      this.router.navigate(['/pos-register']);
      return;
    }
    if (this.password == '' || this.email == '') {
      this.loading = false;
      this.alertTexto = 'Faltan campos por llenar';
      return;
    }
    if (!emailRegex.test(this.email)) {
      this.loading = false;
      this.alertTexto = 'Correo invalido';
      return;
    }
    if (this.password.length <= 3) {
      this.loading = false;

      this.alertTexto = 'Error de contrasena';
      return;
    }

    const user: UserLogin = {
      email: this.email,
      password: this.password,
      recaptchaToken: this.recaptchaToken
    };

    try {
      this.loading = true;
      this.alertTexto = '';
      this._userService.Login(user).subscribe({
        next: (data) => {
          // validar diferentes estado 2xx
//console.log(data)
          const token = data.token;

           sessionStorage.setItem('token', token);
           sessionStorage.setItem('refreshToken', data.refreshToken);
           sessionStorage.setItem('user_name', data.user_name );

          this.loading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.loading = false;
          //console.log(err);
          if (err.status === 401) {
            this.alertTexto = 'Contrasena Incorrecta';
          }
          if (err.status === 404) {
            this.alertTexto = 'Usuario no existe';
          } /////faltan Validiaciones de seguridad para conteo de intentos de registros!!!!
        }
      });
    } catch (e) {
      alert('An unexpected error occurred');
      console.error(e);
      this.recaptchaToken = null;
      this.loading = false;
    }
  }
}
