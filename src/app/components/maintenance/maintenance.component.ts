import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [],
  templateUrl: './maintenance.component.html',
  styleUrl: './maintenance.component.css'
})
export class MaintenanceComponent {
  constructor(private location: Location){}
  comeBack(): void{
    this.location.back()
  }

}
