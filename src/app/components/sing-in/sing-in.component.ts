import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { User } from '../../interfaces/user';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { NextFunction } from 'express';


@Component({
  selector: 'app-sing-in',
  standalone: true,
  imports: [NavbarComponent, FormsModule,RouterOutlet],
  templateUrl: './sing-in.component.html',
  styleUrl: './sing-in.component.css',
})
export class SingInComponent implements OnInit {
  name: string = '';
  lastname: string = '';
  email: string = '';
  password: string = '';
  repeatpassword: string = '';
  credentials: string = '';
  alertTexto:string='';
  verPassword:boolean=false;
  constructor(private _userService: UserService, private router: Router) {}
  ngOnInit(): void {}

  async addUser() {
    if (
      this.name == '' ||
      this.lastname == '' ||
      this.email == '' ||
      this.password == '' ||
      this.repeatpassword == ''
    ) {
      this.alertTexto='Datos incompletos';
      return;
    }

     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
     if (!emailRegex.test(this.email)) {
      this.alertTexto='Debe ingresar un correo valido'
      return

     }



     if (this.password.length<5) {
      this.alertTexto="Contraseña debe tener almenos 5 caracteres"
      return
    }
    const passwordRegex= /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/
    if (!passwordRegex.test(this.password)) {
      this.alertTexto='La contraseña debe contener Mayuscula, Minuscula, Numero y minimo 6 digitos'
      return
    }
    if (this.password !== this.repeatpassword) {
      this.alertTexto='Contraseñas no coinciden';
      return;
    }


    const user: User = {
      name: this.name,
      lastname: this.lastname,
      email: this.email,
      password: this.password

    };


try {


  this._userService.singIn(user).subscribe({
      next: (data)=>{

      console.log(data)
      alert('User '+ data.user + ' has been created');
      this.router.navigate(['/logIn']);
      },
      error: (err)=>{
        if (err.status==409) {
          this.alertTexto="Error, el  correo electronico ingresado ya fue registrado anteriormente"
          return
        }
        console.log(err)
      alert('The user cant be creates by the error' + err)
}})



} catch (error) {
  console.error("error: "+error)
   alert('The user cant be creates by the  unexpected error' +error)
}

}


}
