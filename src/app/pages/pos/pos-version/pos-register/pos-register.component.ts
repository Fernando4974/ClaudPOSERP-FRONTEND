// import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// import { NavbarComponent } from "../../../../components/navbar/navbar.component";
// import { GetAllProduct } from '../../../../interfaces/product';
// import { ProductService } from '../../../../services/product.service';
// import { count, timeout } from 'rxjs';
// import { SaleService } from '../../../../services/sales/sale.service';
// import { CommonModule, NgFor } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-pos-register',
//   standalone: true,
//   imports: [NavbarComponent, CommonModule, FormsModule],
//   templateUrl: './pos-register.component.html',
//   styleUrl: './pos-register.component.css'
// })
// export class PosRegisterComponent implements OnInit {
//   listProduct:GetAllProduct[] = [];
//   filteredProducts: GetAllProduct[] = [];
//   filterTerm:string=''
//   selectedProduct: GetAllProduct | null = null
//   buttons: number[] = Array.from({ length: 25 }, (_, i) => i + 1);
//   carrito: GetAllProduct[] = [];
//   iva:number=0

//   //extistProduct:id


//   constructor(
//     private _productService: ProductService,
//    private _saleService : SaleService
//   ){}
//    ngOnInit(): void {
//      //console.log(this.listProduct)
//   this.getAllProducts()

//   }
//   @ViewChild('scrollContainer') private myScrollContainer!: ElementRef;

// // Este método se ejecuta cada vez que Angular detecta cambios en la vista
// ngAfterViewChecked() {
//     this.scrollToBottom();
// }

// scrollToBottom(): void {
//     try {
//         this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
//     } catch(err) { }
// }
// getAllProducts(){
//      this._productService.getAllProducts().subscribe({
//       next:(data)=>{



//         this.listProduct = data;
//          //console.log(this.listProduct)
//         this.assignProductsToButtons()


//       },
//       error:(err)=> {
//         console.log(err)

//       },
//     })
//   }
// productsMap: { [key: number]: GetAllProduct } = {};



// assignProductsToButtons() {
//   console.log('Iniciando asignación...');

//   this.listProduct.forEach((product) => {
//     // Extraemos el keyNumber del objeto actual
//     const posicion = product.numberKey!;

//     // Validamos que el keyNumber esté en el rango de tus botones (1 al 25)
//     if (posicion >= 1 && posicion <= 25) {
//       // Usamos el keyNumber como la llave del mapa
//       this.productsMap[posicion] = product;

//       //console.log(`Asignado: ${product.title} al botón ${posicion}`);
//     }
//   });

//   console.log('Mapa final de productos:', this.productsMap);
// }
// onKeyClick(buttonNumber: number) {
//   const productoOriginal = this.productsMap[buttonNumber];

//   if (productoOriginal) {
//     // Creamos una copia del producto para no alterar el precio original en la base de datos
//     const nuevoProducto = { ...productoOriginal };

//     // Si hay un precio manual pendiente, lo aplicamos
//     if (this.precioTemporal !== null) {
//       nuevoProducto.price = this.precioTemporal;
//       this.precioTemporal = null; // Reseteamos para la siguiente venta
//     }

//     const productInCarrito = this.carrito.find(item =>
//       item.id === nuevoProducto.id && item.price === nuevoProducto.price
//     );

//     if (productInCarrito) {
//       productInCarrito.count = (productInCarrito.count || 1) + 1;
//     } else {
//       nuevoProducto.count = 1;
//       this.carrito = [...this.carrito, nuevoProducto];
//     }
//   }
// }
// // onKeyClick(buttonNumber: number) {
// //   const producto = this.productsMap[buttonNumber];

// //   if (producto) {
// //     const productInCarrito= this.carrito.find(item=> item.title == producto.title)
// //     if (productInCarrito) {

// //       productInCarrito.count= (productInCarrito.count || 1) +1;




// //     }else{

// //    // if ()
// //     this.selectedProduct = producto;
// //     this.selectedProduct.count=1;
// //     // Usamos el operador spread para que Angular detecte el cambio fácilmente
// //     this.carrito = [...this.carrito, producto ];
// //   }
// // }
// // }
// calcularTotal(): number {
//   return this.carrito.reduce((acc, p) => (acc + p.price * (p.count || 1 )) , 0);
// }

//  showTicket: boolean = false;
// imprimirRecibo(){
//   if (this.carrito.length>0) {
//     this.showTicket = true


//   }


// }
// get subtotal(): number {
//     return this.carrito.reduce((acc, item) => acc + item.price, 0);
//   }
//   calcularIva(): number{
//     const total = this.calcularTotal()
//      this.iva = Math.round( total * 0.12)
//     return this.iva
//   }
//   calcularTotalMasIva():number {

//     return this.calcularTotal() + this.calcularIva()

//   }
//  // Añade esta variable para guardar la venta procesada
// ventaFinalizada: any = null;

// // pos-register.component.ts


// ultimaVentaId: string | null = null;
// crearVenta() {
//   console.log('CAMT CV')
//   if (this.carrito.length === 0) return;

//   // 1. Mapeamos el carrito al DTO que espera NestJS
//   const nuevaVenta = {
//     total: this.calcularTotalMasIva(),
//     iva: this.iva,
//     status: 'completed',
//     items: this.carrito.map(producto => ({
//       productId: producto.id,
//       title:producto.title, // ID del producto en DB
//       quantity: producto.count || 1,
//       priceAtSale: producto.price
//     }))
//   };

//   // 2. Llamada al servicio
//   this._saleService.createSale(nuevaVenta).subscribe({
//     next: (res) => {
//       this.ventaFinalizada = res; // Guardamos datos del servidor (ID, fecha)
//       this.showTicket = true;     // Mostramos el recibo en la pantalla de simulación
//       this.ultimaVentaId = res.id;

//       // 3. Disparamos la impresión real
//       setTimeout(() => {
//         if (this.receiptFlag) {
//       window.print(); // Dispara el diálogo de impresión del sistema
//   }else{
//   console.log('RECEIPT off')
// }
//   this.limpiarCarrito()
//       }, 500);
//     },
//     error: (err) => {
//       console.error('Error al procesar venta:', err);
//       alert('Error en el servidor al guardar la venta');
//     }
//   });
// }
// postReceipt() {
//   if (!this.ultimaVentaId) {
//     alert("No hay transacciones recientes para imprimir.");
//     return;
//   }

//   // Si ya tenemos los datos en 'ventaFinalizada', solo mostramos e imprimimos
//   // Si no, los pedimos al servicio:
//   this._saleService.getSelectSale(this.ultimaVentaId).subscribe({
//     next: (sale) => {
//       // Cargamos el carrito con los items de la venta recuperada para que se vea en el HTML
//       this.carrito = sale.items.map(item => ({
//         id: item.productId,
//         title: item.title,
//         price: item.priceAtSale,
//         count: item.quantity
//       })) as any;

//       this.showTicket = true;

//       // Disparar impresión manual ignorando momentáneamente la bandera de Receipt
//       // (Porque POST es una acción de impresión explícita)
//       setTimeout(() => {
//         if (this.receiptFlag) {
//           window.print();
//         }

//         // Opcional: limpiar después de imprimir el post-recibo
//         // this.limpiarCarrito();
//       }, 300);
//     },
//     error: (err) => console.error("Error al recuperar post-recibo", err)
//   });
// }

// // En tu componente
// mostrarBusqueda: boolean = false; // Por defecto mostramos el detalle de venta


// search() {
//   // Usamos el operador de encadenamiento opcional por si filterTerm es null
//   const term = (this.filterTerm || '').toLowerCase().trim();

//   if (!term) {
//     this.filteredProducts = [...this.listProduct];
//   } else {
//     this.filteredProducts = this.listProduct.filter(product =>
//       product.title.toLowerCase().includes(term) ||
//       (product.description && product.description.toLowerCase().includes(term)) ||
//       product.numberKey?.toString().includes(term)
//     );
//   }
// }


// appendNumber(value: any) {
//   console.log('Botón presionado:', value); // Agrega este log para ver si el clic llega

//   if (this.mostrarBusqueda) {
//     this.filterTerm += value; // Concatenamos el número
//     this.search();            // Ejecutamos el filtro inmediatamente
//   } else {
//     console.warn('Modo búsqueda no activo. Presiona SHIFT primero.');
//   }
// }

// // Opcional: Modificar deleteLastOne para que también funcione con el buscador
// deleteLastOne() {
//   if (this.mostrarBusqueda && this.filterTerm) {
//     this.filterTerm = this.filterTerm.slice(0, -1);
//     this.search();
//   } else {

//   if (this.carrito.length > 0) {
//    this.carrito.pop()
//    this.selectedProduct=this.carrito.length > 0 ? this.carrito[this.carrito.length - 1] : null
//   }


//   }
// }
// agregarAlCarrito(product: any) {
//   // 1. Buscamos si el producto ya está en el carrito
//   const itemExistente= this.carrito.find(item => item.id === product.id);

//   if (itemExistente) {
//     // 2. Si existe, aumentamos el contador
//     itemExistente.count = (itemExistente.count || 0) + 1;
//   } else {
//     // 3. Si no existe, lo agregamos con count = 1
//     // Usamos el spread operator (...) para no modificar el objeto original
//     this.carrito.push({
//       ...product,
//       count: 1
//     });
//   }

//   // OPCIONAL: Volver a la vista del detalle automáticamente tras agregar
//   // this.mostrarBusqueda = false;

//   console.log('Producto agregado:', product.title);
// }
// statusInfo: string[] =[]
// receiptFlag: boolean= true
// receipString ='No Imprimir'
// receipt() {
//     if (this.receiptFlag) {
//         // ACTIVAR: Cambiamos a true y agregamos el indicador visual
//         this.receiptFlag = false;
//         this.statusInfo.push(this.receipString);
//     } else {
//         // DESACTIVAR: Cambiamos a false y removemos el indicador del array
//         this.receiptFlag = true;
//         this.statusInfo = this.statusInfo.filter(status => status !== this.receipString);
//     }
// }
// imprimirFactura() {
//   console.log('CAMT button IP')
//   console.log(this.receiptFlag)


// }

// feedLines: number[] = [];
// limpiarCarrito() {
//   this.carrito = [];
//   this.feedLines=[]
//   this.selectedProduct = null;
//   this.showTicket = false;
// }
// // Define esta variable al inicio de tu clase


// feed() {
//   this.showTicket = true;
//   // Agregamos un elemento al arreglo cada vez que presionas FEED
//   this.feedLines.push(Date.now());
//   console.log('button feed')
// }

// dateString=Date().toLocaleLowerCase().slice(0,25)
// dateFlag: boolean = true
// date(){
//   if (!this.dateFlag) {
//     this.dateFlag=true
//     this. statusInfo = this.statusInfo.filter(status => status !== this.dateString)

//   }else{
//     this.dateFlag=false
//     this.statusInfo.push(this.dateString)
//   }
// }
// openString: string = "Cajon Abierto"
// openFlag:boolean = false
// open(){
//   if (this.openFlag) {
//     this.statusInfo = this.statusInfo.filter(status => status !== this.openString)
//     this.openFlag=false

//   }else{
//     this.statusInfo.push(this.openString)
//     this.openFlag=true

//   }

// }
// ns(){
// const mensajeRS = 'SE RECIBIO EFECTIVO EN CAJA';

//   // 1. Agregamos el mensaje al arreglo de estados
//   if (!this.statusInfo.includes(mensajeRS)) {
//     this.statusInfo.push(mensajeRS);
//   }

//   // 2. Programamos la desaparición tras 5000ms (5 segundos)
//   setTimeout(() => {
//     this.statusInfo = this.statusInfo.filter(status => status !== mensajeRS);
//   }, 5000);


// }
// rs() {
//   const mensajeRS = 'SE RECIBIO EFECTIVO EN CAJA';

//   // 1. Agregamos el mensaje al arreglo de estados
//   if (!this.statusInfo.includes(mensajeRS)) {
//     this.statusInfo.push(mensajeRS);
//   }

//   // 2. Programamos la desaparición tras 5000ms (5 segundos)
//   setTimeout(() => {
//     this.statusInfo = this.statusInfo.filter(status => status !== mensajeRS);
//   }, 5000);
// }
// // Variable para guardar el precio manual antes de asignar el producto
// precioTemporal: number | null = null;

// price() {
//   // Convertimos el valor del buscador (filterTerm) a número
//   const valorIngresado = parseFloat(this.filterTerm);

//   if (!isNaN(valorIngresado) && valorIngresado > 0) {
//     this.precioTemporal = valorIngresado;

//     // Mostramos feedback en el status
//     const mensaje = `PRECIO MANUAL: $${this.precioTemporal}`;
//     this.statusInfo.push(mensaje);

//     // Limpiamos el buscador para que el usuario elija el producto
//     this.filterTerm = '';

//     // Opcional: desaparece el mensaje del status tras 3 segundos
//     setTimeout(() => {
//       this.statusInfo = this.statusInfo.filter(s => s !== mensaje);
//     }, 3000);

//   } else {
//     alert("Primero escribe el precio usando los números.");
//   }
// }
// cancel(){
//   this.carrito=[]
// }
// // Define esta variable en tu clase
// isShiftActive: boolean = false;

// // Este getter generará los números automáticamente según el estado de isShiftActive
// get visibleButtons(): number[] {
//   const inicio = this.isShiftActive ? 26 : 1;
//   return Array.from({ length: 25 }, (_, i) => inicio + i);
// }
// // Modificamos el toggleShift que ya tenías o creamos uno nuevo para esta lógica
// toggleShift() {
//   // Cambia el estado (de true a false y viceversa)
//   this.isShiftActive = !this.isShiftActive;

//   // Actualiza el statusInfo para que el cajero sepa que el nivel 2 está activo
//   if (this.isShiftActive) {
//     if (!this.statusInfo.includes('SHIFT')) {
//       this.statusInfo.push('SHIFT');
//     }
//   } else {
//     this.statusInfo = this.statusInfo.filter(s => s !== 'SHIFT');
//   }
// }
// // toggleShift() {
// //   console.log('shift presonado')
// //   this.mostrarBusqueda = !this.mostrarBusqueda;

// //   // Si activamos la búsqueda, nos aseguramos de que la lista filtrada esté llena
// //   if (this.mostrarBusqueda) {
// //     this.filteredProducts = [...this.listProduct];
// //   }
// // }

// // Variables necesarias en tu clase
// // Variables de apoyo
// cajeroActual: number = 1;

// // 1. Función MENOS (-): Deducción de valor fijo
// teclaMenos() {
//   // Convertimos lo que esté escrito en el buscador a número
//   const montoDeduccion = parseFloat(this.filterTerm);

//   if (!isNaN(montoDeduccion) && this.carrito.length > 0) {
//     // Aplicamos al último artículo del carrito
//     const ultimoItem = this.carrito[this.carrito.length - 1];

//     // Restamos el monto (asegurando que el precio no sea menor a 0)
//     const nuevoPrecio = ultimoItem.price - montoDeduccion;
//     ultimoItem.price = nuevoPrecio < 0 ? 0 : nuevoPrecio;

//     this.statusInfo.push(`DEDUCCION: -$${montoDeduccion.toFixed(2)}`);
//     this.filterTerm = ''; // Limpiamos el buscador tras aplicar
//   } else {
//     this.mostrarMensajeTemporal('ERROR: INGRESE MONTO O CARRITO VACIO');
//   }
// }

// // 2. Función %- : Descuento porcentual
// teclaPorcentaje() {
//   const porcentaje = parseFloat(this.filterTerm);

//   if (!isNaN(porcentaje) && this.carrito.length > 0) {
//     const ultimoItem = this.carrito[this.carrito.length - 1];

//     // Calculamos cuánto representa ese % del precio actual
//     const descuento = (ultimoItem.price * porcentaje) / 100;
//     ultimoItem.price -= descuento;

//     this.statusInfo.push(`DESC: -${porcentaje}% (-$${descuento.toFixed(2)})`);
//     this.filterTerm = '';
//   } else {
//     this.mostrarMensajeTemporal('ERROR: INGRESE %');
//   }
// }

// // 3. Función CLK#: Identificar Cajero
// teclaClerk() {
//   const idCajero = parseInt(this.filterTerm);

//   if (!isNaN(idCajero)) {
//     this.cajeroActual = idCajero;
//   }

//   const mensaje = `CAJERO ${this.cajeroActual} ACTIVO`;
//   this.statusInfo.push(mensaje);
//   this.filterTerm = '';

//   setTimeout(() => {
//     this.statusInfo = this.statusInfo.filter(s => s !== mensaje);
//   }, 3000);
// }

// // Función auxiliar para errores rápidos en el status
// mostrarMensajeTemporal(msg: string) {
//   this.statusInfo.push(msg);
//   setTimeout(() => {
//     this.statusInfo = this.statusInfo.filter(s => s !== msg);
//   }, 3000);
// }
// }
import { Component, ElementRef, OnInit, ViewChild, AfterViewChecked, HostListener } from '@angular/core';
import { NavbarComponent } from "../../../../components/navbar/navbar.component";
import { GetAllProduct, Product } from '../../../../interfaces/product';
import { ProductService } from '../../../../services/product.service';
import { SaleService } from '../../../../services/sales/sale.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ZXingScannerModule } from '@zxing/ngx-scanner'
import { BarcodeFormat } from '@zxing/library';

@Component({
  selector: 'app-pos-register',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule, ZXingScannerModule],
  templateUrl: './pos-register.component.html',
  styleUrl: './pos-register.component.css'
})
export class PosRegisterComponent implements OnInit {
  // Estado de Productos y Carrito
  listProduct: GetAllProduct[] = [];
  filteredProducts: GetAllProduct[] = [];
  productsMap: { [key: number]: GetAllProduct } = {};
  productsMapBC: { [key: string]: GetAllProduct } = {};
  carrito: GetAllProduct[] = [];
  selectedProduct: GetAllProduct | null = null;

  // Variables de Interfaz
  filterTerm: string = '';
  statusInfo: string[] = [];
  showTicket: boolean = false;
  feedLines: number[] = [];

  // Banderas de Estado (Modos Casio)
  isShiftActive: boolean = false;
  mostrarBusqueda: boolean = false;
  receiptFlag: boolean = true;
  dateFlag: boolean = true;
  openFlag: boolean = false;

  // Variables de Cálculos
  iva: number = 0;
  precioTemporal: number | null = null;
  cajeroActual: number = 1;
  ultimaVentaId: string | null = null;
  ventaFinalizada: any = null;

  // Constantes de Texto
  receipString = 'No Imprimir';
  dateString = new Date().toLocaleDateString().slice(0, 25);
  openString = "Cajon Abierto";

 // Cambia tu ViewChild por este:


  constructor(
    private _productService: ProductService,
    private _saleService: SaleService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getAllProducts();
  }

  // ngAfterViewChecked() {
  //   this.scrollToBottom();
  // }

  // --- LÓGICA DE PRODUCTOS ---

  getAllProducts() {
    this._productService.getAllProducts().subscribe({
      next: (data) => {

        this.listProduct = data;
        this.assignProductsToButtons();
        console.log(this.listProduct)
      },
      error: (err) => console.error(err)
    });
  }

  assignProductsToButtons() {
    this.productsMap = {}; // Limpiar mapa
    this.listProduct.forEach((product) => {
      const posicion = product.numberKey!;
      // Aceptamos rango del 1 al 50 para cubrir Shift
      if (posicion >= 1 && posicion <= 50) {
        this.productsMap[posicion] = product;
      }
    });
  }

  get visibleButtons(): number[] {
    const inicio = this.isShiftActive ? 26 : 1;
    return Array.from({ length: 25 }, (_, i) => inicio + i);
  }

onKeyClick(buttonNumber: number) {
  const productoOriginal = this.productsMap[buttonNumber];

  if (!productoOriginal) {
    console.log('Product not found');
    return;
  }

  const precioAAplicar = this.precioTemporal !== null ? this.precioTemporal : productoOriginal.price;
  this.precioTemporal = null;

  const itemIndex = this.carrito.findIndex(item =>
    item.id === productoOriginal.id && item.price === precioAAplicar
  );

  if (itemIndex > -1) {
    const nuevoCarrito = [...this.carrito];
    nuevoCarrito[itemIndex] = {
      ...nuevoCarrito[itemIndex],
      count: (nuevoCarrito[itemIndex].count || 0) + 1
    };
    this.carrito = nuevoCarrito;
  } else {
    const nuevoProducto = { ...productoOriginal, price: precioAAplicar, count: 1 };
    this.carrito = [...this.carrito, nuevoProducto];
  }

  this.scrollToBottom();
  this.focusScanner()
}
   onBarcodeClick(barcode: string) {
  const barcodeTrimmed = barcode.trim();
  const productFound = this.listProduct.find(p => p.barcode === barcodeTrimmed);

  if (!productFound) {
    console.log('Product not found:', barcodeTrimmed);
    return;
  }

  // Creamos la base del producto a añadir
  const precioAAplicar = this.precioTemporal !== null ? this.precioTemporal : productFound.price;
  this.precioTemporal = null; // Limpiar inmediatamente

  const itemIndex = this.carrito.findIndex(item =>
    item.id === productFound.id && item.price === precioAAplicar
  );

  if (itemIndex > -1) {
    // IMPORTANTE: Crear un nuevo array y un nuevo objeto para disparar la detección de cambios
    const nuevoCarrito = [...this.carrito];
    nuevoCarrito[itemIndex] = {
      ...nuevoCarrito[itemIndex],
      count: (nuevoCarrito[itemIndex].count || 0) + 1
    };
    this.carrito = nuevoCarrito;
  } else {
    // Añadir como nuevo
    const nuevoProducto = { ...productFound, price: precioAAplicar, count: 1 };
    this.carrito = [...this.carrito, nuevoProducto];
  }

  this.scrollToBottom();
}

  // --- TECLADO NUMÉRICO Y BUSQUEDA ---

  appendNumber(value: any) {
    this.filterTerm += value;
    if (this.mostrarBusqueda) {
      this.search();
    }
  }

  deleteLastOne() {
    if (this.filterTerm.length > 0) {
      this.filterTerm = this.filterTerm.slice(0, -1);
      if (this.mostrarBusqueda) this.search();
    } else if (this.carrito.length > 0) {
      this.carrito.pop();
      this.selectedProduct = this.carrito.length > 0 ? this.carrito[this.carrito.length - 1] : null;
    }
  }

  search() {
    const term = (this.filterTerm || '').toLowerCase().trim();
    if (!term) {
      this.filteredProducts = [...this.listProduct];
    } else {
      this.filteredProducts = this.listProduct.filter(product =>
        product.title.toLowerCase().includes(term) ||
        product.numberKey?.toString().includes(term)||
        product.barcode?.toString().includes(term)
      );
    }
  }

  // --- FUNCIONES ESPECIALES (BOTONES) ---

  toggleShift() {
    this.isShiftActive = !this.isShiftActive;
    if (this.isShiftActive) {
      if (!this.statusInfo.includes('SHIFT')) this.statusInfo.push('SHIFT');
    } else {
      this.statusInfo = this.statusInfo.filter(s => s !== 'SHIFT');
    }
  }

  plu( barcode?: string) {
    if (barcode) {
      this.filterTerm = barcode
    }
    this.mostrarBusqueda = !this.mostrarBusqueda;
    if (this.mostrarBusqueda) {
      this.statusInfo.push('BUSQUEDA');
      this.search();
    } else {
      this.statusInfo = this.statusInfo.filter(s => s !== 'BUSQUEDA');
    }
  }

  price() {
    const valor = parseFloat(this.filterTerm);
    if (!isNaN(valor) && valor > 0) {
      this.precioTemporal = valor;
      this.mostrarMensajeTemporal(`PRECIO MANUAL: $${this.precioTemporal}`);
      this.filterTerm = '';
    } else {
      alert("Ingrese un precio en el teclado primero.");
    }
  }
teclaMenos() {
  const monto = parseFloat(this.filterTerm);

  if (!isNaN(monto) && this.carrito.length > 0) {
    const ultimo = this.carrito[this.carrito.length - 1];
    ultimo.price = Math.max(0, ultimo.price - monto);

    const mensaje = `DEDUCCION: -$${monto.toFixed(2)}`;
    this.statusInfo.push(mensaje);
    this.filterTerm = '';

    // CORRECCIÓN AQUÍ:
    setTimeout(() => {
      // Reasignamos el arreglo filtrando el mensaje específico
      this.statusInfo = this.statusInfo.filter(info => info !== mensaje);
    }, 2000);

  } else {
    this.mostrarMensajeTemporal('ERROR: MONTO REQUERIDO');
  }
}

  teclaPorcentaje() {
    const porc = parseFloat(this.filterTerm);
    if (!isNaN(porc) && this.carrito.length > 0) {
      const ultimo = this.carrito[this.carrito.length - 1];
      const desc = (ultimo.price * porc) / 100;
      ultimo.price -= desc;
      this.statusInfo.push(`DESC: -${porc}%`);
      this.filterTerm = '';
    }
  }

  teclaClerk() {
    const id = parseInt(this.filterTerm);
    if (!isNaN(id)) this.cajeroActual = id;
    this.mostrarMensajeTemporal(`CAJERO ${this.cajeroActual} ACTIVO`);
    this.filterTerm = '';
  }

  // --- CONTROLES DE CAJA ---

  receipt() {
    this.receiptFlag = !this.receiptFlag;
    if (!this.receiptFlag) {
      this.statusInfo.push(this.receipString);
    } else {
      this.statusInfo = this.statusInfo.filter(s => s !== this.receipString);
    }
  }

  open() {
    this.openFlag = !this.openFlag;
    if (this.openFlag) {
      this.statusInfo.push(this.openString);
    } else {
      this.statusInfo = this.statusInfo.filter(s => s !== this.openString);
    }
  }

  date() {
    this.dateFlag = !this.dateFlag;
    if (!this.dateFlag) {
      this.statusInfo.push(this.dateString);
    } else {
      this.statusInfo = this.statusInfo.filter(s => s !== this.dateString);
    }
  }

  rs() {
    const msg = 'SE RECIBIO EFECTIVO EN CAJA';
    this.statusInfo.push(msg);
    setTimeout(() => this.statusInfo = this.statusInfo.filter(s => s !== msg), 5000);
  }

  ns() { this.rs(); }

  feed() {
    this.showTicket = true;
    this.feedLines.push(Date.now());
  }

  cancel() {
    this.carrito = [];
    this.statusInfo.push("VENTA CANCELADA");
    setTimeout(() => this.statusInfo = this.statusInfo.filter(s => s !== "VENTA CANCELADA"), 2000);
  }

  // --- CÁLCULOS Y VENTAS ---

// --- CÁLCULOS Y VENTAS ---

// 1. Calcula la suma de productos sin impuestos
calcularSubtotal(): number {
  return this.carrito.reduce((acc, item) => acc + (item.price! * (item.count || 1)), 0);
}

// 2. Calcula solo el monto del impuesto basado en el % de TAX
calcularIva(): number {
  const subtotal = this.calcularSubtotal();
  this.iva = Math.round((subtotal * this.impuestoPorcentaje) / 100);
  return this.iva;
}

// 3. El total final que paga el cliente
calcularTotal(): number {
  return this.calcularSubtotal() + this.calcularIva();
}

// Nota: Eliminamos calcularTotalMasIva para evitar confusiones,
// ahora usarás simplemente calcularTotal().

crearVenta(metodoPago : string = 'EFECTiVO') {
  if (this.carrito.length === 0) return;

  const nuevaVenta = {
    total: this.calcularTotal(), // Ya incluye el IVA configurado
    iva: this.calcularIva(),
    status: metodoPago,
    items: this.carrito.map(p => ({
      productId: p.id,
      title: p.title,
      quantity: p.count || 1,
      priceAtSale: p.price
    }))
  };

  this._saleService.createSale(nuevaVenta).subscribe({
    next: (res) => {
      this.ventaFinalizada = res;
      this.ultimaVentaId = res.id;
      this.showTicket = true;
      this.mostrarMensajeTemporal("VENTA EXITOSA");

      setTimeout(() => {
        if (this.receiptFlag) window.print();
        this.limpiarCarrito();
        // Resetear scroll al inicio para la siguiente venta
        if (this.myScrollContainer) this.myScrollContainer.nativeElement.scrollTop = 0;
      }, 500);
    },
    error: (err) => {
      console.error(err);
      this.mostrarMensajeTemporal("ERROR AL GUARDAR");
    }
  });
}

postReceipt() {
  if (!this.ultimaVentaId) {
    this.mostrarMensajeTemporal("NO HAY VENTA PREVIA");
    return;
  }

  this._saleService.getSelectSale(this.ultimaVentaId).subscribe({
    next: (sale) => {
      this.carrito = sale.items.map(item => ({
        id: item.productId,
        title: item.title,
        price: item.priceAtSale,
        count: item.quantity
      })) as any;
      this.showTicket = true;
      setTimeout(() => { if (this.receiptFlag) window.print(); }, 300);
    }
  });
}

  // --- UTILIDADES ---

  limpiarCarrito() {
    this.carrito = [];
    this.feedLines = [];
    this.selectedProduct = null;
    this.showTicket = false;
    this.precioTemporal = null;
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  mostrarMensajeTemporal(msg: string) {
    this.statusInfo.push(msg);
    setTimeout(() => this.statusInfo = this.statusInfo.filter(s => s !== msg), 3000);
  }
  // Añade esto a tu archivo .ts
imprimirRecibo() {
  if (this.carrito.length > 0) {
    this.showTicket = true;
    this.statusInfo.push("SUBTOTAL MOSTRADO");

    // Opcional: limpiar el mensaje después de 2 segundos
    setTimeout(() => {
      this.statusInfo = this.statusInfo.filter(s => s !== "SUBTOTAL MOSTRADO");
    }, 2000);
  } else {
    this.mostrarMensajeTemporal("CARRITO VACÍO");
  }
}
// RA (Received on Account): Entrada de efectivo a la caja (ej. para cambio)
ra() {
  const monto = parseFloat(this.filterTerm);
  if (!isNaN(monto) && monto > 0) {
    const mensaje = `RECIBO ACUENTA: +$${monto.toFixed(2)}`;
    this.statusInfo.push(mensaje);
    this.filterTerm = ''; // Limpiamos teclado

    // Simulamos la apertura de cajón
    if (!this.openFlag) this.open();

    setTimeout(() => {
      this.statusInfo = this.statusInfo.filter(s => s !== mensaje);
    }, 4000);
  } else {
    this.mostrarMensajeTemporal("INGRESE MONTO PARA RA");
  }
}

// PO (Paid Out): Salida de efectivo de la caja (ej. pago a proveedores)
po() {
  const monto = parseFloat(this.filterTerm);
  if (!isNaN(monto) && monto > 0) {
    const mensaje = `PAGO AFUERA: -$${monto.toFixed(2)}`;
    this.statusInfo.push(mensaje);
    this.filterTerm = '';

    // Simulamos la apertura de cajón
    if (!this.openFlag) this.open();

    setTimeout(() => {
      this.statusInfo = this.statusInfo.filter(s => s !== mensaje);
    }, 4000);
  } else {
    this.mostrarMensajeTemporal("INGRESE MONTO PARA PO");
  }
}
off() {

  setTimeout(()=>{

    this.router.navigate(['/posVersion'])

  },2000)
     const mensaje = "SISTEMA BLOQUEADO / OFF";
  if (!this.statusInfo.includes(mensaje)) {
    this.statusInfo = ["SISTEMA BLOQUEADO / OFF"]; // Borra todo y deja solo esto
    this.mostrarBusqueda = false;
    this.filterTerm = '';
  } else {
    // Si ya está en OFF, lo "encendemos"
    this.statusInfo = [];
    this.mostrarMensajeTemporal("SISTEMA REINICIADO");
  }


}
// Define una sensibilidad de scroll (puedes ajustarla a tu gusto)
// Dentro de tu clase PosRegisterComponent
// 1. Asegúrate de que el ViewChild esté así (añadimos static: false)
@ViewChild('scrollContainer', { static: false }) private myScrollContainer!: ElementRef;



SCROLL_STEP = 80;

flechaArriba() {
  const element = this.myScrollContainer?.nativeElement;
  if (!element) return;

  element.scrollTop = Math.max(0, element.scrollTop - this.SCROLL_STEP);
}

flechaAbajo() {
  const element = this.myScrollContainer?.nativeElement;
  if (!element) return;

  const maxScroll = element.scrollHeight - element.clientHeight;
  element.scrollTop = Math.min(maxScroll, element.scrollTop + this.SCROLL_STEP);
}
impuestoPorcentaje = 0; // Por defecto 0%

tax() {
  const valorTeclado = parseFloat(this.filterTerm);

  // CASO A: Si el usuario escribió un número, configuramos el nuevo impuesto
  if (!isNaN(valorTeclado) && valorTeclado > 0) {
    this.impuestoPorcentaje = valorTeclado;
    this.mostrarMensajeTemporal(`IMPUESTO CONFIG: ${this.impuestoPorcentaje}%`);
    this.filterTerm = ''; // Limpiar teclado
  }
  // CASO B: Si el teclado está vacío, mostramos el desglose del total actual
  else if (this.carrito.length > 0) {
    const total = this.calcularTotal();
    const montoTax = (total * this.impuestoPorcentaje) / 100;
    this.mostrarMensajeTemporal(`IVA (${this.impuestoPorcentaje}%): $${montoTax.toFixed(2)}`);
  } else {
    this.mostrarMensajeTemporal("INGRESE % O INICIE VENTA");
  }
}


showHelpModal: boolean = false;

abrirAyuda() {
  this.showHelpModal = true;
}


//BARCODE FUNCTIONS

 @ViewChild('barcodeInput') barcodeInput!: ElementRef<HTMLInputElement>;
@HostListener('window:keydown', ['$event'])
handleGlobalKeyDown(event : KeyboardEvent){
  // Si la búsqueda está abierta, dejamos que el usuario escriba ahí normalmente
    if (this.mostrarBusqueda) {
      return;
    }

    // Si el foco no está ya en el input del scanner, se lo devolvemos
    // Evitamos interrumpir si el usuario presiona teclas especiales como F12, Alt, etc.
    if (document.activeElement !== this.barcodeInput.nativeElement && event.key.length === 1) {
      this.focusScanner();
    }

}
// Función auxiliar para dar foco
  focusScanner() {
    if (this.barcodeInput) {
      this.barcodeInput.nativeElement.focus();
    }
  }
onScan(value: string) {
   console.log(value)
  if (!value)  return
  console.log(value)
  this.onBarcodeClick(value)
// const productFound= this.listProduct.find(p => p.barcode === value)
// if (productFound){
//   this.carrito.push( productFound )
//   console.log('Producto añadito al carrito' , productFound)
// }else{
//   console.log('producto no encontrado')
//   return
// }


}


}
