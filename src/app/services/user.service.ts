import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { User, UserLogin } from '../interfaces/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private AppUrl:string;
  private APIUrlRegister:string;
  private APIUrlLogin:string;
  private APIUrlReqReset:string;
  private APIUrlPasswordReset:string;
  constructor(private readonly http: HttpClient) {
    this.AppUrl=environment.apiUrl;
    this.APIUrlRegister='auth/register'
    this.APIUrlLogin='auth/login'
    this.APIUrlReqReset='auth/password-recovery'
    this.APIUrlPasswordReset='auth/password-reset'
  }

   singIn(user:User):Observable<any>{
    return  this.http.post(`${this.AppUrl}${this.APIUrlRegister}`,user)

  }

  Login(user:UserLogin):Observable<any>{
    return this.http.post(`${this.AppUrl}${this.APIUrlLogin}`,user)
  }
  reqPassword(email:string):Observable<any>{
    console.log(this.AppUrl,this.APIUrlReqReset)
    return this.http.post(`${this.AppUrl}${this.APIUrlReqReset}`,{email},{observe:'response'})
  }
  resetPassword(data:any):Observable<any>{
    return this.http.patch(`${this.AppUrl}${this.APIUrlPasswordReset}`,data,{observe:'response'})
  }

}
