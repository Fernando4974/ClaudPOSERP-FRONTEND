import { Component } from '@angular/core';
import { Location } from '@angular/common';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  constructor(private location: Location) {} // <-- Inyectar aquí

  goBack(): void {
    this.location.back()
    ; // Esto regresa a la página anterior en el historial
  }
}
