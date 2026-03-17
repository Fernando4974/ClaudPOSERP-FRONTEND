import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GetAllProduct } from '../../interfaces/product';
import { ProductService } from '../../services/product.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { Router } from '@angular/router';
import { PaginatioDto } from '../../interfaces/pagination.dto';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { UserService } from '../../services/user.service';
import { HasRoleDirective } from '../../auth/directives/has-role.directive';
import { NavBarService } from '../../services/navBar/navBar.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [NgFor, CommonModule, NavbarComponent, SidebarComponent, FormsModule, SpinnerComponent, HasRoleDirective],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {

  listProduct: GetAllProduct[] = [];
  filteredProducts: GetAllProduct[] = [];
  imagesList = [];
  filterTerm: string = '';
  pagination: PaginatioDto = { limit: 8, offset: 0 };
  spinner: boolean = false;
  isLastPage: boolean = false;

  constructor(
    private productService: ProductService,
    private router: Router,
    public userService: UserService,
    public _navService: NavBarService
  ) {
    this._navService.setExitButtonVisibility(true);
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
    return !this.isLastPage && this.listProduct.length > 0;
  }

  getAll(previousOffset?: number) {
    interface ProductImage {
      url: string;
    }

    interface Product {
      id: string;
      title: string;
      images: ProductImage[];
    }
    this.spinner = true;

    this.productService.getAllProducts(this.pagination).subscribe({
      next: (data: any) => {
        if (data.length === 0 && previousOffset !== undefined) {
          this.pagination.offset = previousOffset;
          this.isLastPage = true;
          this.spinner = false;
          return;
        }

        const limit = this.pagination.limit || 10;
        console.log(data)
        this.listProduct = data;
        this.imagesList = data.map((product: Product) => {
          return product.images && product.images.length > 0 ?
            product.images[0].url : 'assets/no-image.jpg'

        });
        console.log('images:', this.imagesList)
        this.isLastPage = data.length < limit;
        this.applyFilter();
        this.spinner = false;
      },
      error: (err) => {
        console.log(err);
        this.spinner = false;
      }
    });
  }

  private applyFilter() {
    const term = this.filterTerm.toLowerCase().trim();
    if (!term) {
      this.filteredProducts = this.listProduct;
      return;
    }

    this.filteredProducts = this.listProduct.filter(product =>
      (product.title || '').toLowerCase().includes(term) ||
      (product.description || '').toLowerCase().includes(term)
    );
  }

  search() {
    this.applyFilter();
  }

  previousPage() {
    if (!this.hasPreviousPage || this.spinner) {
      return;
    }

    const limit = this.pagination.limit || 10;
    const offset = this.pagination.offset || 0;
    this.pagination.offset = Math.max(offset - limit, 0);
    this.isLastPage = false;
    this.getAll();
  }

  nextPage() {
    if (!this.hasNextPage || this.spinner) {
      return;
    }

    const previousOffset = this.pagination.offset || 0;
    const limit = this.pagination.limit || 10;
    this.pagination.offset = previousOffset + limit;
    this.getAll(previousOffset);
  }

  changePageSize(limit: number) {
    this.pagination.limit = Number(limit) || 10;
    this.pagination.offset = 0;
    this.isLastPage = false;
    this.getAll();
  }

  goToNewProduct() {
    this.router.navigate(['/newProduct']);
  }

  editProduct(id: string) {
    this.router.navigate(['/updateProduct', id]);
  }

  getImage(product: any): string {
    return product && product.images && product.images.length > 0
      ? product.images[0].url
      : '/camera-icon.png';
  }

onImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  const fallbackIcon = '/camera-icon.png'; // Asegúrate de que la ruta sea accesible desde assets

  // Si la imagen que falló NO incluye 'cloudinary' en su URL,
  // o si simplemente falló la carga (independientemente del origen)
  if (!img.src.includes('cloudinary') || img.src !== fallbackIcon) {
    img.src = fallbackIcon;
  }
}
}
