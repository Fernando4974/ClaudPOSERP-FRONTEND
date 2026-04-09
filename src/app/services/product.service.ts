import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetAllProduct, Product, newProduct, updateProduct } from '../interfaces/product';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PaginatioDto } from '../interfaces/pagination.dto';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  apiGetAllUrl: string = '';
  apiNewProductUrl: string = '';
  apiUpdateProductUrl: string = '';
  appUrl: string = '';
  apiGetOneProduct: string = "";
  apiDeleteProduct: string = "";
  apiValideNumberKey : string= ''



  constructor(private http: HttpClient) {
    this.appUrl = environment.apiUrl
    this.apiGetAllUrl = "products/getAll"
    this.apiNewProductUrl = "products/create"
    this.apiValideNumberKey = "products/number-key"
    this.apiUpdateProductUrl = "products/update"
    this.apiGetOneProduct = "products"
    this.apiDeleteProduct = "products"
  }
  getAllProducts(paginationDto?: PaginatioDto): Observable<GetAllProduct[]> {
    // const token = localStorage.getItem('token')
    // const headerToken = new HttpHeaders().set('Authorization',`Bearer ${token}`)
    //old manual return mode --> return this.http.get<Product[]>(`${this.appUrl}${this.apiGetAllUrl}`,{headers:headerToken})
    const limit = paginationDto?.limit || 50;
    const offset = paginationDto?.offset || 0;
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('offset', offset.toString());
    return this.http.get<GetAllProduct[]>(`${this.appUrl}${this.apiGetAllUrl}`, { params })
  }
  _findOneById(id: string): Observable<updateProduct> {


    return this.http.get<updateProduct>(`${this.appUrl}${this.apiGetOneProduct}/${id}`)
  }


  _findNumberKey(data: string): Observable<any> {


    return this.http.get<any>(`${this.appUrl}${this.apiValideNumberKey}/${data}`)
  }

  createProduct(newProduct: newProduct, file: File | null): Observable<any> {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }

    Object.keys(newProduct).forEach(key => {
      const value = (newProduct as any)[key];
      // Evitamos enviar valores null o undefined que puedan romper el back
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });
//console.log(formData)
    return this.http.post(`${this.appUrl}${this.apiNewProductUrl}`, formData);
  }
   updateProduct(updateProduct: updateProduct, file: File | null, id: string): Observable<any> {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }

    Object.keys(updateProduct).forEach(key => {
      const value = (updateProduct as any)[key];
      // Evitamos enviar valores null o undefined que puedan romper el back
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });
    //console.log(formData)
     return this.http.patch(`${this.appUrl}${this.apiUpdateProductUrl}/${id}`, formData);

  }

  _deleteProduct(id:string):Observable<any>{
    return this.http.delete(`${this.appUrl}${this.apiDeleteProduct}/${id}`)

  }







}
