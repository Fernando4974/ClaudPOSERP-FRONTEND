import { Component, OnInit } from '@angular/core';
import { SalesComponent } from '../../pages/sale/sales/sales.component';
import { SaleService } from '../../services/sales/sale.service';
import { NgClass } from "../../../../node_modules/@angular/common/index";

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [],
  templateUrl: './status.component.html',
  styleUrl: './status.component.css'
})
export class StatusComponent implements OnInit {
  mostSoldProduct: string = '';
  mostSaleDay: string = '';
  averageSaleDay: number = 0;
  averageAmountProductSale: number = 0;
  constructor(private _saleService: SaleService) { }

  ngOnInit(): void {
    this.getMostSoldProduct();
    this.getMostSaleDay();
    this.getAverageSaleDay();
    this.getOthers();
  }
  getMostSoldProduct() {
    this._saleService.getAllSales().subscribe(
      (sales) => {

        const productCount: { [key: string]: number } = {};
        sales.forEach((sale: any) => {
          sale.items.forEach((product: any) => {
            if (productCount[product.title]) {
              productCount[product.title] += product.quantity;
            } else {
              productCount[product.title] = product.quantity;
            }
          });
        });
        const mostSoldProduct = Object.keys(productCount).reduce((a, b) => productCount[a] > productCount[b] ? a : b);
        this.mostSoldProduct = mostSoldProduct;
       
      }
    );
  }
  getOthers() {
    this._saleService.getAllSales().subscribe(
      (sales) => {

       const totalItems = sales.reduce((sum: number, sale: any) => sum + parseInt(sale.items.reduce((acc: number, item: any) => acc + item.quantity, 0).toString()), 0);
       const totalSales = sales.length;
       this.averageAmountProductSale = totalItems / totalSales;
      },
      (error) => {
        console.error('Error al obtener las ventas:', error);
      }
    );

  }
 getMostSaleDay() {
  this._saleService.getAllSales().subscribe(
    (response: any) => {

      if (!response || !Array.isArray(response) || response.length === 0) {
        console.warn('La respuesta no es un arreglo o está vacía:', response);
        this.mostSaleDay = 'Sin datos';
        return;
      }

      const salesByDay: { [key: string]: number } = {};


      response.forEach((sale: any) => {
        if (sale.createdAt) {

          const date = sale.createdAt.split('T')[0];
          salesByDay[date] = (salesByDay[date] || 0) + 1;
        }
      });


      const keys = Object.keys(salesByDay);
      if (keys.length > 0) {
        const bestDay = keys.reduce((a, b) =>
          salesByDay[a] > salesByDay[b] ? a : b
        );


        this.mostSaleDay = this.formatDate(bestDay);
      } else {
        this.mostSaleDay = 'N/A';
      }
    },
    (error) => {
      console.error('Error en la petición:', error);
      this.mostSaleDay = 'Error';
    }
  );
}


formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { weekday: 'long', month: 'short', day: 'numeric' });
}
async getAverageSaleDay() {
 await this._saleService.getAllSales().subscribe(
    (response: any) => {

            if (!response || !Array.isArray(response) || response.length === 0) {
        console.warn('La respuesta no es un arreglo o está vacía:', response);
        return;
      }
      const totalSales = response.reduce((sum: number, sale: any) => sum + parseFloat(sale.total), 0);
      const average = totalSales / response.length;
      this.averageSaleDay = average;

    },
    (error) => {
      console.error('Error en la petición:', error);
    }
  );
}
}
