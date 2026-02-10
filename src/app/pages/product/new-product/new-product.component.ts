import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { newProduct } from '../../../interfaces/product';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [NavbarComponent, SidebarComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.css'
})
export class NewProductComponent implements OnInit {

  productForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    price: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]),
    description: new FormControl(''),
    barcode: new FormControl(''),
    stock: new FormControl('', [Validators.pattern(/^\d+(\.\d+)?$/)]),
    posAvalible: new FormControl(true),
    categorie: new FormControl(''),
    imgProduct: new FormControl(''), // Se usa para la vista previa (Base64)
    numberKey: new FormControl<number | null>(null, [Validators.max(25)]),
  });

  alertText = "";
  alertTextOK = "";

  // CORRECCIÓN: Inicializamos como null y permitimos ambos tipos
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(private _serviceProduct: ProductService) {}

  ngOnInit(): void {}

 onFileSelected(event: any) {
  const file: File = event.target.files[0];
  if (file) {
    this.selectedFile = file; // Esto va al FormData

    const reader = new FileReader();
    reader.onload = () => {
      // 2. Guardamos el Base64 solo en la variable de vista previa
      this.imagePreview = reader.result as string;

      // JAMÁS hagas patchValue de un Base64 a un input de tipo archivo
    };
    reader.readAsDataURL(file);
  }
}

  onSubmit() {
    if (this.productForm.invalid) {
      this.alertText = "Por favor, revisa los campos obligatorios.";
      return;
    }

    const formValues = this.productForm.value;

    const productToSend: newProduct = {
      title: formValues.title!,
      description: formValues.description || "",
      barcode: formValues.barcode || "",
      price: parseFloat(formValues.price!),
      stock: formValues.stock ? parseInt(formValues.stock.toString(), 10) : 0,
      posAvalible: !!formValues.posAvalible,
      categorie: formValues.categorie!,
      numberKey: formValues.numberKey ? parseInt(formValues.numberKey.toString(), 10) : 0
    };

    // Enviamos el objeto de datos y el archivo (que puede ser null)
    this._serviceProduct.createProduct(productToSend, this.selectedFile).subscribe({
      next: () => {
        this.alertTextOK = "Producto creado con éxito";
        this.alertText = "";
        this.productForm.reset({ posAvalible: true });
        this.selectedFile = null; // Limpiamos el archivo
        this.imagePreview=null;
      },
      error: (err) => {
        this.alertText = "Error al conectar con el servidor";
        console.error(err);
      }
    });

  }
}
