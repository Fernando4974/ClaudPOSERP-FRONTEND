import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { GetAllSales, newSale, Sale } from "../../interfaces/sale";
import { Observable } from "rxjs";
import { PaginatioDto } from "../../interfaces/pagination.dto";

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
    console.log(saleData)
    return this.http.post(`${this.appUrl}${this.apiCreateSale}`, saleData);
  }

   getAllSales(paginarionDto?:PaginatioDto): Observable<any> {
    const limit = paginarionDto?.limit || 8;
    const offset = paginarionDto?.offset || 0;
    const params = new HttpParams()
        .set('limit', limit.toString())
        .set('offset', offset.toString());
    
    return this.http.get<GetAllSales[]>(`${this.appUrl}${this.apiGetAllSales}`, { params });
  }

  getSelectSale(id: string): Observable<Sale> {
    return this.http.get<Sale>(`${this.appUrl}${this.apiGetThisSale}/${id}`);
  }

  deleteSale(id: string): Observable<any> {
    return this.http.delete(`${this.appUrl}${this.apiDeleteThisSale}/${id}`);
  }
  getSalesDay(): Observable<any> {
    return this.http.get(`${this.appUrl}sales/sales-day`);
  }
  // En tu sale.service.ts (o el servicio que prefieras)
  getAdminPassword(password: string): Observable<any> {
  return this.http.post(`${this.appUrl}auth/validate-admin-password`, { password });
}


}
