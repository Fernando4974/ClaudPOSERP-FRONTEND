





import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { updateProduct } from '../../../interfaces/product';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmModalComponentComponent } from '../../../components/confirm-modal-component/confirm-modal-component.component';
import { SpinnerComponent } from '../../../components/spinner/spinner.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [NavbarComponent, SidebarComponent, ReactiveFormsModule, ConfirmModalComponentComponent, SpinnerComponent, CommonModule],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.css'
})
export class UpdateProductComponent implements OnInit {
  id: string | null = null;
  title: string | null = "";
  isDeleted = false;
  visibleSpinner = false;
  loading = true; // Cambiado a false por defecto

  // Formulario
  productForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    price: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
    description: new FormControl(''),
    barcode: new FormControl(''),
    stock: new FormControl<number>(0, [Validators.pattern(/^\d+$/)]),
    posAvalible: new FormControl(true),
    categorie: new FormControl(''),
    numberKey: new FormControl<number | null>(null, [Validators.max(50)]),
  });

  // Modales y Alertas
  showModal = false;
  showModalExit = false;
  showModalUpdate = false;
  alertText = "";
  alertTextOK = "";

  selectedFile: File | null = null;
  imagePreview: string | null = null;
  originalNumberKey: number | null = null; // Para comparar si cambió

  constructor(
    private _serviceProduct: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
     //console.log('selected file:',this.selectedFile)
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.findOneById(this.id);
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    //console.log('file:',file)
    //console.log('selected file on file selected',this.selectedFile)
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  // Se activa desde el botón del HTML para abrir el modal de confirmación
  confirmUpdate() {
    if (this.productForm.invalid) {
      this.alertText = "Por favor, revisa los campos obligatorios.";
      return;
    }
    this.showModalUpdate = true;
  }

  executeActionUpdate() {
    this.showModalUpdate = false;
    this.onSubmit();
  }

  onSubmit() {
    if (this.isDeleted || this.productForm.invalid) return;

    this.visibleSpinner = true;
    const formValues = this.productForm.value;

    const productToSend: updateProduct = {
      title: formValues.title!,
      description: formValues.description || "",
      barcode: formValues.barcode || "",
      price: Number(formValues.price),
      stock: Number(formValues.stock) || 0,
      posAvalible: !!formValues.posAvalible,
      categorie: formValues.categorie || "",
      numberKey: formValues.numberKey ? parseInt(formValues.numberKey.toString(), 10) : 0
      //numberKey: formValues.numberKey ? Number(formValues.numberKey) : null
    };

    // Si la tecla de acceso rápido cambió, verificamos si ya existe
    if (productToSend.numberKey && productToSend.numberKey !== this.originalNumberKey) {
      this._serviceProduct._findNumberKey(productToSend.numberKey.toString()).subscribe({
        next: (res) => {
          if (res.exist) {
            this.visibleSpinner = false;
            this.alertText = 'Ya existe un Producto con esa Tecla de Acceso Rápido';
          } else {
            this.sendUpdate(productToSend);
          }
        },
        error: (error) => {

          //console.log(error)
          this.handleError("Error al verificar la tecla")
        }


      });
    } else {
      this.sendUpdate(productToSend);
    }
  }

  private sendUpdate(product: updateProduct) {
     //console.log('send:',this.selectedFile)
     if (!this.selectedFile) {
      const reader = new FileReader();
      const img = this.imagePreview

     }
    this._serviceProduct.updateProduct(product, this.selectedFile, this.id!).subscribe({
      next: (data) => {
        // console.log(data)
        this.visibleSpinner = false;
        this.alertTextOK = "Producto actualizado correctamente";
        this.alertText = "";
        // Opcional: navegar hacia atrás después de un tiempo
        setTimeout(() => this.comeBack(), 1500);
      },
      error: (err) =>{
         //console.log(err);
        if (err.status === 409) {
          this.handleError("Ya existe un Producto con el mismo nombre o código de Barras");
        } else {
          this.handleError("Error al conectar con el servidor");
        }

    }
  });
}


  findOneById(id: string) {
    this.visibleSpinner = true;
    this._serviceProduct._findOneById(id).subscribe({
      next: (data: any) => {
        this.visibleSpinner = false;
        this.title = data.title;
        this.originalNumberKey = data.numberKey;

        this.productForm.patchValue({
          title: data.title,
          price: data.price,
          description: data.description,
          barcode: data.barcode,
          stock: data.stock,
          posAvalible: data.posAvalible,
          categorie: data.categorie,
          numberKey: data.numberKey
        });

        if (data.images?.length > 0) {
          this.imagePreview = data.images[0].url;
        }
      },
      error: (err) => {
        this.visibleSpinner = false;
        this.alertText = "No se pudo cargar el producto.";
      }
    });
  }

  deleteProduct(id: string) {
    this.visibleSpinner = true;
    this._serviceProduct._deleteProduct(id).subscribe({
      next: () => {
        this.visibleSpinner = false;
        this.isDeleted = true;
        this.showModalExit = true;
      },
      error: () => this.handleError("Error al eliminar el producto")
    });
  }

  executeAction() {
    this.showModal = false;
    if (this.id) this.deleteProduct(this.id);
  }

  private handleError(message: string) {
    this.visibleSpinner = false;
    this.alertText = message;
  }

  comeBack() {
    this.router.navigate(['/product']);
  }
}
