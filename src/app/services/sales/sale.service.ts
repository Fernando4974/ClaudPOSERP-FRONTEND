import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { newSale, Sale } from "../../interfaces/sale";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SaleService{
  appUrl: string ='';
  apiCreateSale: string = '';
  apiGetAllSales: string = '';
  apiGetThisSale: string = '';
  apiDeleteThisSale: string = '';

  constructor(private http: HttpClient){
    this.appUrl= environment.apiUrl;
    this.apiCreateSale='sales/create';
    this.apiGetAllSales='sales/get-all';
    this.apiGetThisSale='sales';
    this.apiDeleteThisSale='sales';
  }
  // sale.service.ts
createSale(saleData: any): Observable<any> {
  console.log(this.appUrl,this.apiCreateSale,'/', saleData)
  return this.http.post(`${this.appUrl}${this.apiCreateSale}`,saleData); // <-- ¡El 'return' es vital!
}
getAllSales():Observable<any>{
  return this.http.get(`${this.appUrl}${this.apiGetAllSales}`)
}
getSelectSale(id: string):Observable<Sale>{
  return this.http.get<Sale>(`${this.appUrl}${this.apiGetThisSale}/${id}`)
}
deleteSale(id: string): Observable<any>{

  return this.http.delete<Sale>(`${this.appUrl}${this.apiDeleteThisSale}/${id}`)
}
}
