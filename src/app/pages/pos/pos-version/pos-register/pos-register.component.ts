import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from "../../../../components/navbar/navbar.component";
import { GetAllProduct } from '../../../../interfaces/product';
import { ProductService } from '../../../../services/product.service';
import { count } from 'rxjs';

@Component({
  selector: 'app-pos-register',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './pos-register.component.html',
  styleUrl: './pos-register.component.css'
})
export class PosRegisterComponent implements OnInit {
  listProduct:GetAllProduct[] = [];
  selectedProduct: GetAllProduct | null = null
  buttons: number[] = Array.from({ length: 25 }, (_, i) => i + 1);
  carrito: GetAllProduct[] = [];

  //extistProduct:id


  constructor(private _productService: ProductService ){}
   ngOnInit(): void {
     //console.log(this.listProduct)
  this.getAllProducts()

  }
  @ViewChild('scrollContainer') private myScrollContainer!: ElementRef;

// Este método se ejecuta cada vez que Angular detecta cambios en la vista
ngAfterViewChecked() {
    this.scrollToBottom();
}

scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
}
getAllProducts(){
     this._productService.getAllProducts().subscribe({
      next:(data)=>{



        this.listProduct = data;
         //console.log(this.listProduct)
        this.assignProductsToButtons()


      },
      error:(err)=> {
        console.log(err)

      },
    })
  }
productsMap: { [key: number]: GetAllProduct } = {};



assignProductsToButtons() {
  console.log('Iniciando asignación...');

  this.listProduct.forEach((product) => {
    // Extraemos el keyNumber del objeto actual
    const posicion = product.numberKey!;

    // Validamos que el keyNumber esté en el rango de tus botones (1 al 25)
    if (posicion >= 1 && posicion <= 25) {
      // Usamos el keyNumber como la llave del mapa
      this.productsMap[posicion] = product;

      //console.log(`Asignado: ${product.title} al botón ${posicion}`);
    }
  });

  console.log('Mapa final de productos:', this.productsMap);
}
onKeyClick(buttonNumber: number) {
  const producto = this.productsMap[buttonNumber];

  if (producto) {
    const productInCarrito= this.carrito.find(item=> item.title == producto.title)
    if (productInCarrito) {

      productInCarrito.count= (productInCarrito.count || 1) +1;




    }else{

   // if ()
    this.selectedProduct = producto;
    this.selectedProduct.count=1;
    // Usamos el operador spread para que Angular detecte el cambio fácilmente
    this.carrito = [...this.carrito, producto ];
  }
}
}
calcularTotal(): number {
  return this.carrito.reduce((acc, p) => (acc + p.price * (p.count || 1 )) , 0);
}
deleteLastOne(){
  if (this.carrito.length > 0) {
   this.carrito.pop()
   this.selectedProduct=this.carrito.length > 0 ? this.carrito[this.carrito.length - 1] : null
  }

}
 showTicket: boolean = false;
imprimirRecibo(){
  if (this.carrito.length>0) {
    this.showTicket = true


  }
}
get subtotal(): number {
    return this.carrito.reduce((acc, item) => acc + item.price, 0);
  }
  calcularIva(): number{
    const total = this.calcularTotal()
    return Math.round( total * 0.12)
  }
  calcularTotalMasIva():number {

    return this.calcularTotal() + this.calcularIva()

  }
}
