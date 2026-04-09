import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { newProduct } from '../../../interfaces/product';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../../../components/spinner/spinner.component';

@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [NavbarComponent, SidebarComponent, ReactiveFormsModule, CommonModule, SpinnerComponent],
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.css'
})
export class NewProductComponent implements OnInit {
  loading:boolean=false;

  productForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    price: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]),
    description: new FormControl(''),
    barcode: new FormControl(''),
    stock: new FormControl('', [Validators.pattern(/^\d+(\.\d+)?$/)]),
    posAvalible: new FormControl(true),
    categorie: new FormControl(''),
    imgProduct: new FormControl(''), // Se usa para la vista previa (Base64)
    numberKey: new FormControl<number | null>(null, [Validators.max(50), Validators.min(1)]),
  });

  alertText = "";
  alertTextOK = "";
  disableButton:boolean=true
  numberKeyExist:boolean = true

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
valideNumberKey(numberKey:string){
  this.numberKeyExist=true
  this._serviceProduct._findNumberKey(numberKey).subscribe({
    next: (data) =>{
      console.log(this.numberKeyExist)
//console.log('inside next valide number key')
//console.log(data)
      this.numberKeyExist = data.exist
      //console.log(this.numberKeyExist)
    },
    error: (err) => {
     // console.log(err)

    },

  })

}

  onSubmit() {
    if (this.productForm.invalid) {
      this.alertText = "Por favor, revisa los campos obligatorios.";
      return;
    }
    this.disableButton=false
       this.alertText = "";
          this.alertTextOK = "";
    this.loading=true


    const formValues = this.productForm.value;

    const productToSend: newProduct = {
      title: formValues.title!,
      description: formValues.description || "",
      barcode: formValues.barcode || "",
      price: parseFloat(formValues.price!),
      stock: formValues.stock ? parseInt(formValues.stock.toString(), 10) : 0,
      posAvalible: !!formValues.posAvalible,
      categorie: formValues.categorie!,
      numberKey: formValues.numberKey ? parseInt(formValues.numberKey.toString(), 10) : undefined
    };
    console.log(productToSend.numberKey)
    if (productToSend.numberKey && productToSend.numberKey>0) {

    this._serviceProduct.
    _findNumberKey(productToSend.numberKey.toString()).
    subscribe({

      next:(data)=> {
        if (data.exist) {
          this.alertText='Ya existe un Producto guardado con esa Tecla de Acceso Rapido'
          this.loading=false
          this.disableButton=true
        }else{
          this.ejecutarCreacion(productToSend)

        }



      },
      error:(err)=> {

        console.log(err)

      },

    })

    }else{
      this.ejecutarCreacion(productToSend)
    }
  }
  onScan(value: string) {
  if (value) {
    console.log('Enviando a NestJS:', value);
    // Lógica para enviar al backend
  }
}

ejecutarCreacion(productToSend: newProduct) {
  this._serviceProduct.createProduct(productToSend, this.selectedFile).subscribe({
    next: () => {
      this.alertTextOK = "Producto creado con éxito";
      this.productForm.reset({ posAvalible: true });
      this.loading = false;
      this.disableButton = true;
      this.imagePreview = null;
    },
    error: (err) => {
      console.log(err)
      this.loading = false;
      this.disableButton = true;
      this.alertText = err.error.statusCode === 409 ? "Ya existe un Producto con el mismo nombre o codigo de Barras" : "Error de servidor";
    }
  });
}
}
