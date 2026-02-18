import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from "../../../../components/navbar/navbar.component";
import { GetAllProduct } from '../../../../interfaces/product';
import { ProductService } from '../../../../services/product.service';
import { count } from 'rxjs';
import { SaleService } from '../../../../services/sales/sale.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pos-register',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './pos-register.component.html',
  styleUrl: './pos-register.component.css'
})
export class PosRegisterComponent implements OnInit {
  listProduct:GetAllProduct[] = [];
  selectedProduct: GetAllProduct | null = null
  buttons: number[] = Array.from({ length: 25 }, (_, i) => i + 1);
  carrito: GetAllProduct[] = [];
  iva:number=0

  //extistProduct:id


  constructor(
    private _productService: ProductService,
   private _saleService : SaleService
  ){}
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
     this.iva = Math.round( total * 0.12)
    return this.iva
  }
  calcularTotalMasIva():number {

    return this.calcularTotal() + this.calcularIva()

  }
 // Añade esta variable para guardar la venta procesada
ventaFinalizada: any = null;

// pos-register.component.ts



crearVenta() {
  if (this.carrito.length === 0) return;

  // 1. Mapeamos el carrito al DTO que espera NestJS
  const nuevaVenta = {
    total: this.calcularTotalMasIva(),
    iva: this.iva,
    status: 'completed',
    items: this.carrito.map(producto => ({
      productId: producto.id,
      title:producto.title, // ID del producto en DB
      quantity: producto.count || 1,
      priceAtSale: producto.price
    }))
  };

  // 2. Llamada al servicio
  this._saleService.createSale(nuevaVenta).subscribe({
    next: (res) => {
      this.ventaFinalizada = res; // Guardamos datos del servidor (ID, fecha)
      this.showTicket = true;     // Mostramos el recibo en la pantalla de simulación

      // 3. Disparamos la impresión real
      setTimeout(() => {
        window.print();
        // Opcional: limpiar después de imprimir o dejar que el usuario vea el ticket
        // this.limpiarCarrito();
      }, 500);
    },
    error: (err) => {
      console.error('Error al procesar venta:', err);
      alert('Error en el servidor al guardar la venta');
    }
  });
}

imprimirFactura() {
  window.print(); // Dispara el diálogo de impresión del sistema
}

limpiarCarrito() {
  this.carrito = [];
  this.selectedProduct = null;
  this.showTicket = false;
}
}
