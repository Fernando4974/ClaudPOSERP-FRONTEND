import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <--- IMPORTANTE
import { GetAllProduct } from '../../interfaces/product';
import { ProductService } from '../../services/product.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { Router } from '@angular/router';
import { PaginatioDto } from '../../interfaces/pagination.dto';
import { SpinnerComponent } from '../../components/spinner/spinner.component';

@Component({
  selector: 'app-product',
  standalone: true,
  // Añadimos FormsModule aquí para que funcione el [(ngModel)]
  imports: [NgFor, CommonModule, NavbarComponent, SidebarComponent, FormsModule, SpinnerComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {

  listProduct: GetAllProduct[] = [];
  filteredProducts: GetAllProduct[] = []; // Lista que se muestra en el HTML
  filterTerm: string = ''; // Variable vinculada al input
  pagination: PaginatioDto = { limit: 10, offset: 0 };
  spinner: boolean = false;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    this.spinner= true
    this.productService.getAllProducts(this.pagination).subscribe({
      next: (data) => {
        this.spinner= false
        this.listProduct = data;
        this.filteredProducts = data; // Inicialmente mostramos todo
      },

      error: (err) => {console.log(err); this.spinner= false}
    });
  }

  // Lógica de búsqueda
  search() {
    const term = this.filterTerm.toLowerCase().trim();
    if (!term) {
      this.filteredProducts = this.listProduct;
    } else {
      this.filteredProducts = this.listProduct.filter(product =>
        product.title.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term)
      );
    }
  }

  goToNewProduct() {
    this.router.navigate(["/newProduct"]);
  }

  editProduct(id: string) {
    this.router.navigate(["/updateProduct", id]);
  }
}
