
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
  isModalOpen: boolean = false;
  flagCancel: boolean = false;

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
    // Dentro de ngOnInit
const modalElement = document.getElementById('modalPassword');
modalElement?.addEventListener('hidden.bs.modal', () => {
  this.isModalOpen = false;
});
  }

  // ngAfterViewChecked() {
  //   this.scrollToBottom();
  // }
 // CIERRE DE CAJA
mostrarReporte: boolean = false;
ventasDelDia: any[] = [];

// El botón ON debe poner esto en FALSE para volver a la venta
irAModoVenta() {
  this.mostrarReporte = false;   // Apaga reporte
  this.mostrarBusqueda = false; // Opcional: apaga búsqueda también si quieres ir directo al detalle
}
// El botón X/Z debe poner esto en TRUE para mostrar el reporte
getTotalCaja() {
  this._saleService.getSalesDay().subscribe({
    next: (data) => {
      this.ventasDelDia = data;
      this.mostrarBusqueda= false;

      this.mostrarReporte = true;

    },
    error: (err) => {
      console.error('Error al obtener total de caja:', err);
    }
  });
}

calcularTotalVentas(): number {
  if (!this.ventasDelDia || this.ventasDelDia.length === 0) return 0;
  return this.ventasDelDia.reduce((acc, sale) => {
    const monto = parseFloat(sale.total) || 0;
    return acc + monto;
  }, 0);
}


  // --- LÓGICA DE PRODUCTOS ---

  getAllProducts() {
    this._productService.getAllProducts().subscribe({
      next: (data) => {
        this.listProduct = data;
        this.assignProductsToButtons();
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
    this.mostrarMensajeTemporal("Producto no encontrado");
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

  // deleteLastOne() {
  //   if (this.filterTerm.length > 0) {
  //     this.filterTerm = this.filterTerm.slice(0, -1);
  //     if (this.mostrarBusqueda) this.search();
  //   } else if (this.carrito.length > 0) {
  //     this.carrito.pop();
  //     this.selectedProduct = this.carrito.length > 0 ? this.carrito[this.carrito.length - 1] : null;
  //   }
  // }
  // Variables nuevas
passwordAdmin: string = '';
passwordCorrecta: string = '1234'; // Aquí pones tu clave de gerente

// // Modificamos el método original para que solo prepare el terreno
// confirmarBorrado() {
//   // Si no hay nada que borrar, no pedimos clave
//   if (this.filterTerm.length === 0 && this.carrito.length === 0) return;

//   // Si es solo borrar texto del buscador, lo permitimos sin clave
//   if (this.filterTerm.length > 0) {
//     this.ejecutarBorradoReal();
//     return;
//   }

//   // Si es borrar un producto del carrito, abrimos el modal
//   const modalElement = document.getElementById('modalPassword');
//   if (modalElement) {
//     this.isModalOpen = true;
//     const modal = new (window as any).bootstrap.Modal(modalElement);
//     this.passwordAdmin = ''; // Limpiamos el input
//     modal.show();
//     setTimeout(() => {
//        const input = document.querySelector('#passwordInput') as HTMLElement;
//        input?.focus();
//     }, 500);

//   }
// }
confirmarBorrado() {
  if (this.filterTerm.length === 0 && this.carrito.length === 0) return;

  if (this.filterTerm.length > 0) {
    this.ejecutarBorradoReal();
    return;
  }

  const modalElement = document.getElementById('modalPassword');
  if (modalElement) {
    this.isModalOpen = true;
    this.passwordAdmin = ''; // Limpiamos el input

    const modal = new (window as any).bootstrap.Modal(modalElement);

    // ESCUCHAR EL EVENTO DE BOOTSTRAP (Mejor que setTimeout)
    modalElement.addEventListener('shown.bs.modal', () => {
      const input = modalElement.querySelector('input') as HTMLElement;
      input?.focus();
    }, { once: true }); // { once: true } asegura que el listener se borre tras usarse una vez

    modal.show();
  }
}

// El método que realmente hace el trabajo
ejecutarBorradoReal() {
  if (this.filterTerm.length > 0) {
    this.filterTerm = this.filterTerm.slice(0, -1);
    if (this.mostrarBusqueda) this.search();
  } else if (this.carrito.length > 0) {
    if (this.flagCancel) {
      this.carrito = [];
      this.flagCancel = false;
    }else {
    this.carrito.pop();
    this.selectedProduct = this.carrito.length > 0 ? this.carrito[this.carrito.length - 1] : null;
  }
}
}

// Validación de la clave
validarYBorrar() {

  this._saleService.getAdminPassword(this.passwordAdmin).subscribe({
    next: (res) => {
      if (res) {
     this.mostrarMensajeTemporal("Contraseña correcta. Acción permitida.");
          this.ejecutarBorradoReal();


    const modalElement = document.getElementById('modalPassword');
    const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
    modal.hide();
    this.isModalOpen = false;
  } else {
   this.mostrarMensajeTemporal("Contraseña incorrecta. Acción denegada.");
    this.passwordAdmin = '';
  }
},

    error: (res) => {
  console.log(res)
}
  });
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

  // --- FUNCIONES ESPECIALES ---

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

 this.flagCancel = true;
 console.log('Intentando cancelar venta. Flag cancel:', this.flagCancel);


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
    const fecha = new Date().toLocaleDateString();
  const hora = new Date().toLocaleTimeString();

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
  console.log(nuevaVenta);

  this._saleService.createSale(nuevaVenta).subscribe({
    next: (res) => {
      this.ventaFinalizada = res;
      this.ultimaVentaId = res.id;
      this.showTicket = true;
      this.mostrarMensajeTemporal("VENTA EXITOSA");

      setTimeout(() => {
        if (this.receiptFlag){
        // window.print();
        ///
        // New receipt format
        ///
          const filasProductos = this.carrito.map(v => `
    <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #ccc; padding: 5px 0; font-size: 12px;">
      <span>#${v.title}</span>
      <span>$${v.price}</span>
      <span> x ${v.count}</span>
      <span>  -- $${((v.price)*(v.count!)).toFixed(2)}</span>

    </div>
  `).join('');
        const ventanaImpresion = window.open('', '_black');
        ventanaImpresion?.document.write(`
    <html>
      <head>
        <title>Reporte de Venta - ${fecha}</title>
        <style>
          body { font-family: 'Courier New', Courier, monospace; width: 80mm; margin: 0; padding: 10px; }
          h2 { text-align: center; margin-bottom: 5px; font-size: 16px; }
          .header { text-align: center; margin-bottom: 15px; font-size: 12px; border-bottom: 2px solid #000; padding-bottom: 5px; }
          .iva { margin-top: 10px; border-top: 1px solid #000; padding-top: 6px; text-align: right; font-size: 16px; font-weight: bold; }

          .total { margin-top: 15px; border-top: 2px solid #000; padding-top: 10px; text-align: right; font-size: 16px; font-weight: bold; }
          .footer { margin-top: 20px; text-align: center; font-size: 10px; }
        </style>
      </head>
      <body>
        <h2>REPORTE DE VENTA</h2>
        <div class="header">
          Fecha: ${fecha}<br>
          Hora: ${hora}<br>
          Productos: ${this.carrito.length}
        </div>
        <div class="items">
          ${filasProductos}
        </div>
         <div class="iva">
          IVA % ${this.impuestoPorcentaje}: $${(nuevaVenta.iva).toFixed(2)}
        </div>
        <div class="total">
          TOTAL VENTA: $${(this.calcularTotal()).toFixed(2)}
        </div>
        <div class="footer">
         -- Gracias por su Visita -- <br>
        clauderp.netlify.app

        </div>
      </body>
    </html>
  `);
  ventanaImpresion?.document.close();
  ventanaImpresion?.focus();

  // Pequeño delay para asegurar que los estilos carguen antes de imprimir
  setTimeout(() => {
    ventanaImpresion?.print();
    ventanaImpresion?.close();
  }, 250);





        }
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
handleGlobalKeyDown(event: KeyboardEvent) {
  // Si estamos en búsqueda, modal de password o ayuda, NO forzamos el foco del scanner
  if (this.mostrarBusqueda || this.isModalOpen || this.showHelpModal) {
    return;
  }

  // Si el usuario presiona una tecla de un solo carácter (letras/números)
  // y no tiene el foco en el input, se lo devolvemos.
  if (event.key.length === 1 && document.activeElement !== this.barcodeInput.nativeElement) {
    this.focusScanner();
  }
}
// @HostListener('window:keydown', ['$event'])
// handleGlobalKeyDown(event : KeyboardEvent){
//   // Si la búsqueda está abierta, dejamos que el usuario escriba ahí normalmente
//     if (this.mostrarBusqueda) {
//       return;
//     }
//     if (this.isModalOpen) {
//     return;
//   }

//     // Si el foco no está ya en el input del scanner, se lo devolvemos
//     // Evitamos interrumpir si el usuario presiona teclas especiales como F12, Alt, etc.
//     if (document.activeElement !== this.barcodeInput.nativeElement && event.key.length === 1) {
//       this.focusScanner();
//     }

// }
// Función auxiliar para dar foco
 focusScanner() {
  // El setTimeout(..., 0) saca la ejecución del ciclo actual de eventos
  // evitando que el navegador se bloquee en un bucle infinito
  setTimeout(() => {
    if (!this.barcodeInput || this.isModalOpen || this.mostrarBusqueda) return;

    const input = this.barcodeInput.nativeElement;
    // Solo damos foco si no lo tiene ya para evitar disparar eventos innecesarios
    if (document.activeElement !== input) {
      input.focus();
    }
  }, 0);
}
onScan(value: string) {
  if (!value) return;
  this.onBarcodeClick(value);
  this.filterTerm = ''; // Limpiar si es necesario
  this.barcodeInput.nativeElement.value = ''; // Limpiar el input físico
}




  setAngle(deg: number): void {
    const sw = document.getElementById('main-switch') as HTMLElement | null;
    if (sw) {
      sw.style.setProperty('--angle', `${deg}deg`);
    }
  }

  imprimirReporteCaja() {
  const fecha = new Date().toLocaleDateString();
  const hora = new Date().toLocaleTimeString();
  const totalCaja = this.calcularTotalVentas().toFixed(2);

  // Creamos el contenido de las filas dinámicamente
  const filasVentas = this.ventasDelDia.map(v => `
    <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #ccc; padding: 5px 0; font-size: 12px;">
      <span>#${v.id} - ${v.status}</span>
      <span>$${v.total}</span>
      <span>${new Date(v.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
    </div>
  `).join('');

  // Creamos una ventana temporal
  const ventanaImpresion = window.open('', '_blank');

  ventanaImpresion?.document.write(`
    <html>
      <head>
        <title>Reporte de Caja - ${fecha}</title>
        <style>
          body { font-family: 'Courier New', Courier, monospace; width: 80mm; margin: 0; padding: 10px; }
          h2 { text-align: center; margin-bottom: 5px; font-size: 16px; }
          .header { text-align: center; margin-bottom: 15px; font-size: 12px; border-bottom: 2px solid #000; padding-bottom: 5px; }
          .total { margin-top: 15px; border-top: 2px solid #000; padding-top: 10px; text-align: right; font-size: 16px; font-weight: bold; }
          .footer { margin-top: 20px; text-align: center; font-size: 10px; }
        </style>
      </head>
      <body>
        <h2>REPORTE DE CAJA</h2>
        <div class="header">
          Fecha: ${fecha}<br>
          Hora: ${hora}<br>
          Ventas totales: ${this.ventasDelDia.length}
        </div>
        <div class="items">
          ${filasVentas}
        </div>
        <div class="total">
          TOTAL DÍA: $${totalCaja}
        </div>
        <div class="footer">
          -- Fin del Reporte --
        </div>
      </body>
    </html>
  `);

  ventanaImpresion?.document.close();
  ventanaImpresion?.focus();

  // Pequeño delay para asegurar que los estilos carguen antes de imprimir
  setTimeout(() => {
    ventanaImpresion?.print();
    ventanaImpresion?.close();
  }, 250);

}
}


