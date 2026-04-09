import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit{
  role:string=""
  user:boolean=true
  ngOnInit(): void {
    this.role=sessionStorage.getItem('user_data') || ""
    if (this.role =='["user"]') {

  this.user=false;
    }

  }

  constructor(private location: Location) {}

  goBack(): void {
    this.location.back()
    ;
  }
}
