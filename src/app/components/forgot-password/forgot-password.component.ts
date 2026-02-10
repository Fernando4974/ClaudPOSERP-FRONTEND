import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { SpinnerComponent } from '../spinner/spinner.component';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [NavbarComponent, FormsModule, SpinnerComponent, NgIf,CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnInit {
  email: string = "";
  alertTexto: string = "";
  veryfiTexto: string = "";
  loading:boolean=false;
  loadingImg:boolean=false;

  constructor (private _userService: UserService, private router: Router) { }

  ngOnInit(): void {

  }
  sendEmail() {
    this.veryfiTexto=""
    this.alertTexto=""
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (this.email == "") {
      this.alertTexto = "Es necesario el correo electronico de tu cuenta"
      return
    }

    if (!emailRegex.test(this.email)) {
      this.alertTexto = 'Correo invalido';
      return
    }
    this.loading=true

    this._userService.reqPassword(this.email).subscribe({
      next: (res) => {
        console.log(res)
  if (res.status == 201) {
console.log(res);
  this.veryfiTexto="Se ha enviado un correo a tu cuenta con las instrucciones para restablecer tu contraseña";
 this.loading=false
 this.loadingImg=true
 }
      },
      error: (err) => {
        this.loading=false
        if (err.status == 404) {
    this.alertTexto = "El correo no esta registrado" }else{
      this.alertTexto = "Error en el servidor, intente mas tarde"
        }

    }
  })


  }



}
