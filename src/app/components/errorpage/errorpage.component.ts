import { Component } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-errorpage',
  standalone: true,
  imports: [],
  templateUrl: './errorpage.component.html',
  styleUrl: './errorpage.component.css'
})
export class ErrorpageComponent {
  constructor(private location: Location){}

  comeBack():void{
    this.location.back();

  }


}
