import { Component } from '@angular/core';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { Product, updateProduct } from '../../../interfaces/product';
import { ActivatedRoute, Router} from '@angular/router';
import { ConfirmModalComponentComponent } from '../../../components/confirm-modal-component/confirm-modal-component.component';

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [NavbarComponent, SidebarComponent, ReactiveFormsModule, ConfirmModalComponentComponent],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.css'
})
export class UpdateProductComponent {
  productToUpdate: updateProduct[] = [];
  id: string | null = "";
  title: string | null = "";
  isDeleted= false;
  //ulrImage: string ='';
  productForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    price: new FormControl<number>(0,[Validators.min(0)] ),
    description: new FormControl(''),
    barcode: new FormControl(''),
    stock: new FormControl<number>(0, [Validators.pattern(/^\d+(\.\d+)?$/)]),
    posAvalible: new FormControl(true),
    categorie: new FormControl(''),
    imgProduct: new FormControl(''), // Se usa para la vista previa (Base64)
    numberKey: new FormControl<number | null>(null, [Validators.max(25)]),
  });
  showModal = false;
  showModalExit = false;

executeAction() {
  this.showModal = false; // Cerramos el modal
  this.deleteProduct(this.route.snapshot.paramMap.get('id')!);   // Llamamos a tu lógica de guardado que ya armamos
}

  alertText = "";
  alertTextOK = "";

  // CORRECCIÓN: Inicializamos como null y permitimos ambos tipos
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(private _serviceProduct: ProductService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {

    this.id = this.route.snapshot.paramMap.get('id')
    if (!this.isDeleted) {
      this.findOneById(this.id!||'empty')
    }




  }


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
    if (this.isDeleted) return;
    if (this.productForm.invalid) {
      this.alertText = "Por favor, revisa los campos obligatorios.";
      return;
    }

    const formValues = this.productForm.value;

    const productToSend: updateProduct = {
     // id: this.id = "",
      title: formValues.title!,
      description: formValues.description || "",
      barcode: formValues.barcode || "",
      price: formValues.price!,
      stock: formValues.stock ? parseInt(formValues.stock.toString(), 10) : 0,
      posAvalible: !!formValues.posAvalible,
      categorie: formValues.categorie!,
      numberKey: formValues.numberKey ? parseInt(formValues.numberKey.toString(), 10) : 0
    };

    // Enviamos el objeto de datos y el archivo (que puede ser null)
    this._serviceProduct.updateProduct(productToSend, this.selectedFile,this.route.snapshot.paramMap.get('id')! ).subscribe({
      next: () => {
        this.alertTextOK = "Producto creado con éxito";
        this.alertText = "";
        this.productForm.reset({ posAvalible: true });
        this.selectedFile = null; // Limpiamos el archivo
        this.imagePreview = null;
      },
      error: (err) => {
        this.alertText = "Error al conectar con el servidor";
        console.error(err);
      }
    });
  }


  findOneById(id: string) {
    if (this.isDeleted || id === 'empty') return;
    this._serviceProduct._findOneById(id.trim()).subscribe({
      next: (data:any) => {
         console.log('subscribe sucessfull')
        console.log({data})
        this.alertTextOK = "";
        this.alertText = "";
        this.title = data.title;
        const product = {...data}
        this.productToUpdate[0] = product;
        this.productForm.patchValue(data)
       if (data.images && data.images.length > 0) {
         this.imagePreview = data.images[0].url
       }

      },
      error: (err) => {
        console.log('error en subscribe')
        console.log('id:',id)
        this.alertText = "";
        console.error('ServerExecuteError:',err);
      }
    })
  }
  comeBack(){
        this.router.navigate(['/product'])
  }
  deleteProduct(id:string){
    this.isDeleted = true;

    this._serviceProduct._deleteProduct(id).subscribe({
      next: (data) =>{
        this.isDeleted=true
        console.log(data)
        this.showModalExit=true;

      },
      error:(err) => {
        console.log(err)
        this.isDeleted = false;

      },
    })

  }

}
