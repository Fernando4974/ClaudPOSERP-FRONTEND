import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { newSale } from "../../interfaces/sale";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SaleSevice{
  appUrl: string ='';
  apiCreateSale: string = '';
  apiGetAllSales: string = '';

  constructor(private http: HttpClient){
    this.appUrl= environment.apiUrl;
    this.apiCreateSale='sales/create';
    this.apiGetAllSales='sales/get-all';
  }
  // sale.service.ts
createSale(saleData: any): Observable<any> {
  console.log(this.appUrl,this.apiCreateSale,'/', saleData)
  return this.http.post(`${this.appUrl}${this.apiCreateSale}`,saleData); // <-- ¡El 'return' es vital!
}
getAllSales():Observable<any>{
  return this.http.get(`${this.appUrl}${this.apiGetAllSales}`)
}
}
