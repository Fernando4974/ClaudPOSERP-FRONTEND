import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';
import { connect } from 'rxjs';
import { connectToServer } from '../../web-socket/socket-client';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  constructor(private router: Router) {

  }
  ngOnInit(): void {

   

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

  configModule(){
    this.router.navigate(["/maintenancePage"]);
  }

  employedModule(){
    this.router.navigate(["/maintenancePage"]);
  }
  countModule(){
    this.router.navigate(["/maintenancePage"]);
  }


}

