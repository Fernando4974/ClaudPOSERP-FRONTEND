import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GetAllSales } from '../../../interfaces/sale';
import { SpinnerComponent } from '../../../components/spinner/spinner.component';
import { SaleService } from '../../../services/sales/sale.service';
import { Router } from '@angular/router';
import { PaginatioDto } from '../../../interfaces/pagination.dto';
import { NavBarService } from '../../../services/navBar/navBar.service';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [NavbarComponent, SidebarComponent, CommonModule, SpinnerComponent, FormsModule],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css'
})
export class SalesComponent implements OnInit {
  filterTerm: string = '';
  filteredSales: GetAllSales[] = [];
  listSale: GetAllSales[] = [];
  spinnerVisible: boolean = false;
  pagination: PaginatioDto = { limit: 8, offset: 0 };
  isLastPage: boolean = false;

  constructor(private _salesServise: SaleService, private router: Router,public _navNarService : NavBarService) {
      this._navNarService.setExitButtonVisibility(true)
     }


  ngOnInit(): void {
    this.getAll();
  }

  get currentPage(): number {
    const limit = this.pagination.limit || 8;
    const offset = this.pagination.offset || 0;
    return Math.floor(offset / limit) + 1;
  }

  get hasPreviousPage(): boolean {
    return (this.pagination.offset || 0) > 0;
  }

  get hasNextPage(): boolean {
    return !this.isLastPage && this.listSale.length > 0;
  }

  getAll(previousOffset?: number) {
    this.spinnerVisible = true;

    this._salesServise.getAllSales(this.pagination).subscribe({
      next: (value) => {
        // Si se intentó avanzar y no llegaron datos, volvemos al offset anterior.
        if (value.length === 0 && previousOffset !== undefined) {
          this.pagination.offset = previousOffset;
          this.isLastPage = true;
          this.spinnerVisible = false;
          return;
        }

        const limit = this.pagination.limit || 8;
        this.listSale = value
        this.isLastPage = value.length < limit;
        this.search();
        this.spinnerVisible = false;
      },
      error: (err) => {
        console.log(err);
        this.spinnerVisible = false;
      },
    });
  }

  search() {
    const term = this.filterTerm.toLowerCase().trim();

    if (!term) {
      this.filteredSales = [...this.listSale];
      return;
    }
    this.filteredSales = this.listSale.filter(sale => {
  // Aseguramos que el término de búsqueda esté en minúsculas para una comparación insensible
  const searchTerm = term.toLowerCase();

  // Convertimos la fecha a string y verificamos si incluye el término
  const dateStr = sale.createdAt ? String(sale.createdAt).toLowerCase() : '';

  return dateStr.includes(searchTerm);
});

    // this.filteredSales = this.listSale.filter(sale => {
    //   const idMatch = String(sale.id?.toString()).toLowerCase().includes(term);
    //   const totalMatch = sale.total?.toString().includes(term);
    //   const dateStr = sale.createdAt ? String(sale.createdAt).toLowerCase() : '';
    //   const dateMatch = dateStr.includes(term);
    //   const statusMatch = sale.status?.toLowerCase().includes(term);

    //   return idMatch || totalMatch || dateMatch || statusMatch;
    // });
  }

  editSale(item: string) {
    this.router.navigate(['/view-sales', item]);
  }

  previousPage() {
    if (!this.hasPreviousPage || this.spinnerVisible) {
      return;
    }

    const limit = this.pagination.limit || 8;
    const offset = this.pagination.offset || 0;
    this.pagination.offset = Math.max(offset - limit, 0);
    this.isLastPage = false;
    this.getAll();
  }

  nextPage() {
    if (!this.hasNextPage || this.spinnerVisible) {
      return;
    }

    const previousOffset = this.pagination.offset || 0;
    const limit = this.pagination.limit || 8;
    this.pagination.offset = previousOffset + limit;
    this.getAll(previousOffset);
  }

  changePageSize(limit: number) {
    this.pagination.limit = Number(limit) || 8;
    this.pagination.offset = 0;
    this.isLastPage = false;
    this.getAll();
  }
}
