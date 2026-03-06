





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
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.findOneById(this.id);
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
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
        error: () => this.handleError("Error al verificar la tecla")
      });
    } else {
      this.sendUpdate(productToSend);
    }
  }

  private sendUpdate(product: updateProduct) {
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



//old mode



// import { Component } from '@angular/core';
// import { NavbarComponent } from '../../../components/navbar/navbar.component';
// import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
// import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
// import { ProductService } from '../../../services/product.service';
// import { Product, updateProduct } from '../../../interfaces/product';
// import { ActivatedRoute, Router} from '@angular/router';
// import { ConfirmModalComponentComponent } from '../../../components/confirm-modal-component/confirm-modal-component.component';
// import { SpinnerComponent } from '../../../components/spinner/spinner.component';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-update-product',
//   standalone: true,
//   imports: [NavbarComponent, SidebarComponent, ReactiveFormsModule, ConfirmModalComponentComponent, SpinnerComponent, CommonModule],
//   templateUrl: './update-product.component.html',
//   styleUrl: './update-product.component.css'
// })
// export class UpdateProductComponent {
//   productToUpdate: updateProduct[] = [];
//   id: string | null = "";
//   title: string | null = "";
//   isDeleted= false;
//   visibleSpinner=false;
//   loading= true;
//   confirm= false;
//   existNumberKey=true
//   //ulrImage: string ='';
//   productForm = new FormGroup({
//     title: new FormControl('', [Validators.required, Validators.minLength(3)]),
//     price: new FormControl<number>(0,[Validators.min(0)] ),
//     description: new FormControl(''),
//     barcode: new FormControl(''),
//     stock: new FormControl<number>(0, [Validators.pattern(/^\d+(\.\d+)?$/)]),
//     posAvalible: new FormControl(true),
//     categorie: new FormControl(''),
//     imgProduct: new FormControl(''), // Se usa para la vista previa (Base64)
//     numberKey: new FormControl<number | null>(null, [Validators.max(25)]),
//   });
//   showModal = false;
//   showModalExit = false;
//   showModalUpdate = false;
//   action=0

// executeAction() {
//   this.showModal = false; // Cerramos el modal
//   this.deleteProduct(this.route.snapshot.paramMap.get('id')!);   // Llamamos a tu lógica de guardado que ya armamos}
// }




// executeActionUpdate() {
//   this.showModalUpdate = false;
//   this.onSubmit()

// }

//   alertText = "";
//   alertTextOK = "";

//   // CORRECCIÓN: Inicializamos como null y permitimos ambos tipos
//   selectedFile: File | null = null;
//   imagePreview: string | null = null;

//   constructor(private _serviceProduct: ProductService, private route: ActivatedRoute, private router: Router) { }

//   ngOnInit(): void {

//     this.id = this.route.snapshot.paramMap.get('id')
//     if (!this.isDeleted) {
//       this.findOneById(this.id!||'empty')
//     }




//   }


//   onFileSelected(event: any) {
//     const file: File = event.target.files[0];
//     if (file) {
//       this.selectedFile = file; // Esto va al FormData

//       const reader = new FileReader();
//       reader.onload = () => {
//         // 2. Guardamos el Base64 solo en la variable de vista previa
//         this.imagePreview = reader.result as string;

//         // JAMÁS hagas patchValue de un Base64 a un input de tipo archivo
//       };
//       reader.readAsDataURL(file);
//     }
//   }

//   onSubmit() {

//     if (this.isDeleted) return;
//     if (this.productForm.invalid) {
//       this.alertText = "Por favor, revisa los campos obligatorios.";
//       return;
//     }
//     this.loading=false
//     this.visibleSpinner=true

//     if (!this.existNumberKey) {



//     const formValues = this.productForm.value;

//     const productToSend: updateProduct = {
//      // id: this.id = "",
//       title: formValues.title!,
//       description: formValues.description || "",
//       barcode: formValues.barcode || "",
//       price: formValues.price!,
//       stock: formValues.stock ? parseInt(formValues.stock.toString(), 10) : 0,
//       posAvalible: !!formValues.posAvalible,
//       categorie: formValues.categorie!,
//       numberKey: formValues.numberKey ? parseInt(formValues.numberKey.toString(), 10) : 0
//     };
//     console.log('product from updateComponent:', productToSend);
//     console.log('file selected from updateComponent :', this.selectedFile)

//     if (productToSend.numberKey) {
//       this._serviceProduct
//       ._findNumberKey(productToSend.numberKey.toString()).subscribe({
//          next:(data)=> {
//         if (data.exist) {
//           this.alertText='Ya existe un Producto guardado con esa Tecla de Acceso Rapido'

//         }else{
//           this._serviceProduct.updateProduct(productToSend, this.selectedFile,this.route.snapshot.paramMap.get('id')! ).subscribe({
//       next: (data) => {
//         this.visibleSpinner=false
//         this.loading=true
//         console.log('data:', data)
//         this.alertTextOK = "Producto actualizado";
//         this.alertText = "";
//         this.productForm.reset({ posAvalible: true });
//         this.selectedFile = null; // Limpiamos el archivoA
//         this.imagePreview = null;
//       },
//       error: (err) => {
//         this.visibleSpinner=false
//         this.alertText = "Error al conectar con el servidor";
//         console.error(err);
//          this.loading=true
//       }
//     });
//     }

//         },
//           error:(err)=> {

//         console.log(err)

//       },


//       })
//     }

//     // Enviamos el objeto de datos y el archivo (que puede ser null)

//   }
// }


//   findOneById(id: string) {
//     this.visibleSpinner=true
//     if (this.isDeleted || id === 'empty') return;
//     this._serviceProduct._findOneById(id.trim()).subscribe({
//       next: (data:any) => {
//         this.visibleSpinner=false
//          console.log('subscribe sucessfull')
//         console.log({data})
//         this.alertTextOK = "";
//         this.alertText = "";
//         this.title = data.title;
//         const product = {...data}
//         this.productToUpdate[0] = product;
//         this.productForm.patchValue(data)
//        if (data.images && data.images.length > 0) {
//          this.imagePreview = data.images[0].url
//        }

//       },
//       error: (err) => {
//         this.visibleSpinner=false
//         console.log('error en subscribe')
//         console.log('id:',id)
//         this.alertText = "";
//         console.error('ServerExecuteError:',err);
//       }
//     })
//   }
//   comeBack(){
//         this.router.navigate(['/product'])
//   }
//   deleteProduct(id:string){
//     this.visibleSpinner=true
//     this.isDeleted = true;

//     this._serviceProduct._deleteProduct(id).subscribe({
//       next: (data) =>{
//         this.visibleSpinner=false
//         this.isDeleted=true
//         console.log(data)
//         this.showModalExit=true;

//       },
//       error:(err) => {
//         this.visibleSpinner=false
//         console.log(err)
//         this.isDeleted = false;

//       },
//     })

//   }

// }
