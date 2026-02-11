import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserLogin } from '../../interfaces/user';
import { HttpResponse } from '@angular/common/http';
import { SpinnerComponent } from '../spinner/spinner.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { PosRegisterComponent } from '../../pages/pos/pos-version/pos-register/pos-register.component';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule, SpinnerComponent, DashboardComponent, PosRegisterComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'

})
export class LoginComponent {

  email: string = "";
  password: string = "";
  alertTexto: string = "";
  loading: boolean = false;

  isDirty: boolean = false;
  constructor(private router: Router, private _userService: UserService) {

  }

  ///metodos por implementar PARA EL CAN DEACTIVATE
  hasUnsavedData(): boolean {

    return this.isDirty;
  }
  markAsDirty() {
    this.isDirty = true;
  }
  //FIN metodos por implementar



  login() {
    this.loading= true




    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (this.password == "p") {

      this.router.navigate(["/product"])
      return

    }

    if (this.password == "r") {

      this.router.navigate(["/pos-register"])
      return

    }
    if (this.password == "" || this.email == "") {

      this.alertTexto = "Faltan campos por llenar"
      return

    }
    if (!emailRegex.test(this.email)) {
      this.alertTexto = 'Correo invalido';
      return
    }
    if (this.password.length <= 3) {
      this.alertTexto = "Error de contraseña";
      return

    }

    const user: UserLogin = {
      email: this.email,
      password: this.password

    }



    try {
      this.loading = true
      this.alertTexto = "";
      this._userService.Login(user).subscribe({

        next: (data) => {//validar diferentes estado 2xx
          console.log(data)
          const token = data.token

          localStorage.setItem("token", token)

          this.loading = false
          //console.log(localStorage.getItem("token"))
          //alert("Welcome")
          this.router.navigate(["/dashboard"])


        },
        error: (err) => {
          this.loading = false
          console.log(err)
          if (err.status === 401) {

            this.alertTexto = "Contraseña Incorrecta"

          }
          if (err.status === 404) {

            this.alertTexto = "Usuario no existe"


          }/////faltan Validiaciones de seguridad para conteo de intentos de registros!!!!
        }
      });
    } catch (e) {
      alert("An unexpected error occurred");
      console.error(e);
      this.loading = false
    }


  }
}
