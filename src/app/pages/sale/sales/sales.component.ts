import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GetAllSales } from '../../../interfaces/sale';
import { SpinnerComponent } from '../../../components/spinner/spinner.component';
import { SaleService } from '../../../services/sales/sale.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [NavbarComponent, SidebarComponent,CommonModule, SpinnerComponent, FormsModule],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css'
})
export class SalesComponent implements OnInit {
  filterTerm :string=''
  filteredSales: GetAllSales[]=[];
  listSale:GetAllSales[]=[];
  spinnerVisible:boolean=false;

  constructor(private _salesServise: SaleService, private router: Router){}

  ngOnInit(): void {
    this.getAll()
  }
  getAll(){
    this.spinnerVisible=true;
    this._salesServise.getAllSales().subscribe({
      next:(value)=> {
        this.spinnerVisible=false
        this.listSale=value
        this.filteredSales=value
      },
      error:(err)=> {
      this.spinnerVisible=false
      },
    });
  }
search() {
  const term = this.filterTerm.toLowerCase().trim();

  // Si no hay término, regresamos la lista completa
  if (!term) {
    this.filteredSales = [...this.listSale];
    return;
  }

  this.filteredSales = this.listSale.filter(sale => {
    // 1. Convertimos ID a string por si acaso y comparamos
    const idMatch = sale.id?.toString().toLowerCase().includes(term);

    // 2. Para el total, lo convertimos a string para búsqueda parcial (ej: buscar "50" en "150.00")
    const totalMatch = sale.total?.toString().includes(term);

    // 3. Para la fecha, manejamos si es String o Date object
    const dateStr = sale.createdAt ? String(sale.createdAt).toLowerCase() : '';
    const dateMatch = dateStr.includes(term);

    // 4. (Opcional) Si quieres buscar por status que tienes en el HTML
    const statusMatch = sale.status?.toLowerCase().includes(term);

    return idMatch || totalMatch || dateMatch || statusMatch;
  });
}
  editSale(item:string){

    this.router.navigate(["/view-sales",item])
  }


  }



