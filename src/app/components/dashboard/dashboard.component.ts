import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';
import { NavBarService } from '../../services/navBar/navBar.service';
import { NgIf } from "@angular/common"
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavbarComponent, NgIf],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  providers: [NavBarService]
})
export class DashboardComponent implements OnInit {
public userRole: string | null = '';
  constructor(private router: Router, public _navService: NavBarService) {
     this._navService.setExitButtonVisibility(true)


  }

  ngOnInit(): void {


    if (localStorage.getItem('user_data')) {
      this.userRole = localStorage.getItem('user_data')
    }





  }

  productModule(){
    this.router.navigate(["/product"]);
  }

  posModule(){
    this.router.navigate(["/posVersion"]);
  }

  clientModule(){
    this.router.navigate(["/maintenancePage"]);
  }

  salesModule(){
    this.router.navigate(["/sales"])
  }
  configModule(){
    this.router.navigate(["/user"]);
  }

  employedModule(){
    this.router.navigate(["/maintenancePage"]);
  }
  countModule(){
    this.router.navigate(["/maintenancePage"]);
  }


}

