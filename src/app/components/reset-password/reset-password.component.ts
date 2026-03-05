import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
//import { NgModel } from '@angular/forms';
import { NgIf, NgStyle } from '@angular/common';
import { AbstractControl, FormsModule } from '@angular/forms';
import { SpinnerComponent } from '../spinner/spinner.component';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [NavbarComponent, NgIf, FormsModule, SpinnerComponent, NgStyle],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit{

  email:string="";emailDisabled:boolean=true;
  alertTexto:string="";
  verifyTexto:string="";
  loading:boolean=false;
  loadingImg:boolean=false;
  password:string="";
  rPassword:string="";
  buttonDisabled:boolean=false;
  buttonCancelDisabled:boolean=true;
  token:string=""
verPassword:boolean=false

  constructor(private _uservice:UserService, private params:ActivatedRoute, private route:Router) {

  }
  ngOnInit(): void {
     const queryParams = this.params.snapshot.queryParamMap;

     this.token= queryParams.get('token') || "";
     if(this.token==""){
        alert("No se ha recibido el token, intente nuevamente");
        this.route.navigate(['/login']);
        return
     }
      this.email=queryParams.get('email') || "";
      if(this.email==""){
        alert("No se ha recibido el email, intente nuevamente");
        this.route.navigate(['/login']);
        return
      }
  }
  resetPassword(){
this.alertTexto="";
this.verifyTexto="";
    if(this.password.length<5){
      this.alertTexto="La contraseña debe tener al menos 5 caracteres";
      return;
    }
    if(this.password!=this.rPassword){
      this.alertTexto="Las contraseñas no coinciden";
      return;
    }
    if(this.password.length>20){
      this.alertTexto="La contraseña no debe tener más de 20 caracteres";
      return;
    }
    if(this.password.trim()==""){
      this.alertTexto="La contraseña no puede estar vacía";
      return;
    }

    //service reset password
    this.loading=true;
    this._uservice.resetPassword({token:this.token,newPassword:this.password}).subscribe({

      next:(res)=>{
         console.log('next')
        this.loading=false;
        this.verifyTexto="Contraseña restablecida con éxito, ya puede iniciar sesión con su nueva contraseña";
      this.buttonDisabled=true;
      this.buttonCancelDisabled=false;
      },
      error:(err)=>{
        this.loading=false;
        if(err.status == 409){
          this.alertTexto="La nueva contraseña no puede ser igual a la anterior";
        }else{
          console.log(err)
        this.alertTexto="Error al restablecer la contraseña, intente nuevamente";
        }
      }
    });






  }

}
