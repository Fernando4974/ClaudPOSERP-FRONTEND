import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavBarService } from '../../services/navBar/navBar.service';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

flagExitButton:boolean=true
public role: string | null=''


  ///4:29 min tutorial
  constructor(public navService: NavBarService){

  }
  ngOnInit(): void {
    this.role= localStorage.getItem('user_data')
  


}
  logOut(){
    localStorage.removeItem('token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('_grecaptcha');
    window.location.reload();
    this.navService.setExitButtonVisibility(false)
  }


}
