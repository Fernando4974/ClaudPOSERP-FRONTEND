import { CommonModule } from '@angular/common';
import { Component, Injectable, OnInit } from '@angular/core';
import { NavBarService } from '../../services/navBar/navBar.service';
import { UserService } from '../../services/user.service';
import { ConfirmModalComponentComponent } from '../confirm-modal-component/confirm-modal-component.component';
import { Router } from '@angular/router';
import { SocialAuthService } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, ConfirmModalComponentComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
@Injectable()
export class NavbarComponent implements OnInit {
  flagExitButton: boolean = true;
  public role: string | null = '';
  public tokenUser: string | null = '';
  public userName: string | null = '';
  public modalView = false;

  ///4:29 min tutorial
  constructor(
    public navService: NavBarService,
    private router: Router,
    public _authService: SocialAuthService
  ) { }
  ngOnInit(): void {
    this.role = sessionStorage.getItem('user_data');
    this.tokenUser = sessionStorage.getItem('token');
    this.userName = sessionStorage.getItem('user_name');

  }
  modal() {
    this.modalView = true;
  }

  logOut() {
 // Borra TODO de la pestaña actual
  sessionStorage.clear();

  // Borra TODO lo permanente (por si acaso quedó algo de antes)
  localStorage.clear();
  this._authService.signOut().catch(err => console.log('Google ya estaba cerrado'));

  // 3. Navegamos al login

    this.router.navigate(['/logIn']);
  }
}
