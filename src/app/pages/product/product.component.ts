import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <--- IMPORTANTE
import { GetAllProduct } from '../../interfaces/product';
import { ProductService } from '../../services/product.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { Router } from '@angular/router';
import { PaginatioDto } from '../../interfaces/pagination.dto';

@Component({
  selector: 'app-product',
  standalone: true,
  // Añadimos FormsModule aquí para que funcione el [(ngModel)]
  imports: [NgFor, CommonModule, NavbarComponent, SidebarComponent, FormsModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {

  listProduct: GetAllProduct[] = [];
  filteredProducts: GetAllProduct[] = []; // Lista que se muestra en el HTML
  filterTerm: string = ''; // Variable vinculada al input
  pagination: PaginatioDto = { limit: 10, offset: 0 };

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    this.productService.getAllProducts(this.pagination).subscribe({
      next: (data) => {
        this.listProduct = data;
        this.filteredProducts = data; // Inicialmente mostramos todo
      },
      error: (err) => console.log(err)
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
