import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

flagExitButton:boolean=true

  ///4:29 min tutorial
  constructor(){

  }
  logOut(){
    localStorage.removeItem('token');
    window.location.reload();
  }
  buttonVisibility(flag:boolean){
    this.flagExitButton=flag
  }


}
