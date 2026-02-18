import { Component, NgModule, OnInit } from '@angular/core';
import { ConfirmModalComponentComponent } from '../../../components/confirm-modal-component/confirm-modal-component.component';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpinnerComponent } from '../../../components/spinner/spinner.component';
import { ActivatedRoute, Router } from '@angular/router';


import { SaleService } from '../../../services/sales/sale.service';
import { Sale } from '../../../interfaces/sale';

@Component({
  selector: 'app-view-sales',
  standalone: true,
  imports: [ConfirmModalComponentComponent,ReactiveFormsModule, SidebarComponent,NavbarComponent,CommonModule,FormsModule, SpinnerComponent],
  templateUrl: './view-sales.component.html',
  styleUrl: './view-sales.component.css'
})
export class ViewSalesComponent implements OnInit{
  // Tipado basado en tu Entity
  public sale: Sale | null = null;
  public idSale: string = '';

  // Control de UI
  public loading: boolean = false;
  public visibleSpinner: boolean = true;
  public showModal: boolean = false;
  public showModalExit: boolean = false;
  public alertText: string = '';
  public alertTextOK: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private saleService: SaleService
  ) {}

  ngOnInit(): void {
    // Obtenemos el ID de la URL (ej: /sales/abc-123)
    this.idSale = this.route.snapshot.paramMap.get('id') || '';
    if (this.idSale) {
      this.getSaleDetails();
    }
  }

  /**
   * Obtiene la venta y sus SaleItems desde el backend
   */
  getSaleDetails() {
    this.visibleSpinner = true;
    this.saleService.getSelectSale(this.idSale).subscribe({
      next: (data: Sale) => {
        this.sale = data;
        console.log(data)
        this.visibleSpinner = false;
        this.loading = true; // Habilita los botones de acción
      },
      error: (err) => {
        this.visibleSpinner = false;
        this.alertText = 'No se pudo cargar la información de la venta.';
        console.error(err);
      }
    });
  }

  /**
   * Lógica para eliminar la venta (Action Confirm)
   */
  executeAction() {
    this.showModal = false;
    this.visibleSpinner = true;

    this.saleService.deleteSale(this.idSale).subscribe({
      next: (data) => {
        this.visibleSpinner = false;
        this.showModalExit = true; // Muestra modal de éxito
      },
      error: (err) => {
        this.visibleSpinner = false;
        this.alertText = 'Error al intentar eliminar la venta.';
      }
    });
  }

  /**
   * Navegación hacia atrás
   */
  comeBack() {
    this.router.navigate(['/sales']); // Ajusta a tu ruta de lista de ventas
  }

  /**
   * Cálculo opcional de subtotal por ítem
   * (Aunque se puede hacer directo en el HTML como lo puse antes)
   */
  calculateSubtotal(quantity: number, price: number): number {
    return quantity * price;
  }
  get subtotalSinIva(): number {
  if (!this.sale) return 0;
  return Number(this.sale.total) - Number(this.sale.iva || 0);
}
}
