import { Component, Injectable } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from "@angular/forms";
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { inject } from '@angular/core';
import { InactivityService } from './services/inactivity/inactivity.service';





@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, RouterOutlet, CommonModule,NgIf,NgFor],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'ClaudPosERP';
 private _inactivityService = inject(InactivityService)
}
