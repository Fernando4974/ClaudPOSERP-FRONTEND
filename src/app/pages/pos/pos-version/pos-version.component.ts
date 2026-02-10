import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../../../components/navbar/navbar.component";
import { Route, Router } from '@angular/router';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-pos-version',
  standalone: true,
  imports: [NavbarComponent, SidebarComponent],
  templateUrl: './pos-version.component.html',
  styleUrl: './pos-version.component.css'
})
export class PosVersionComponent implements OnInit {
  constructor( private router: Router) { }

  ngOnInit(): void {

  }
S800(){

  this.router.navigate(['/pos-register']);

}
T500(){

  this.router.navigate(['/maintenancePage']);

}
more(){

  this.router.navigate(['/maintenancePage']);

}
modern(){

  this.router.navigate(['/maintenancePage']);

}


}
