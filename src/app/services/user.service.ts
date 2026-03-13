import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { User, UserLogin } from '../interfaces/user';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable();

  private AppUrl:string;
  private APIUrlRegister:string;
  private APIUrlLogin:string;
  private APIUrlReqReset:string;
  private APIUrlPasswordReset:string;
  private APIUrlGetUser:string;
  private APIUrlUpdateThisUser:string;
  constructor(private readonly http: HttpClient) {
    this.AppUrl=environment.apiUrl;
    this.APIUrlRegister='auth/register'
    this.APIUrlLogin='auth/login'
    this.APIUrlReqReset='auth/recover-password'
    this.APIUrlPasswordReset='auth/password-reset'
    this.APIUrlGetUser='auth/user-update'
    this.APIUrlUpdateThisUser='auth/update-user'
  }

   singIn(user:User):Observable<any>{
    return  this.http.post(`${this.AppUrl}${this.APIUrlRegister}`,user)

  }
  Login(user: UserLogin): Observable<any> {
    return this.http.post(`${this.AppUrl}${this.APIUrlLogin}`, user).pipe(
      tap((response: any) => {
        // Guardamos el usuario completo (que trae los roles) en el storage
        localStorage.setItem('user_data', JSON.stringify(response.userRoles));
        this.userSubject.next(response.userRoles);
      })
    );
  }
getUserRoles(): string {
  const userData = localStorage.getItem('user_data');
  console.log(userData)
  if (!userData) return 'Role Not Found';


    return userData || 'Role Not Found';


  }

  hasRole(role: string): boolean {
    const userRole = localStorage.getItem('user_data')!;
    if (userRole.includes(role)) {
    return true
    }
    return false

  }

  // Login(user:UserLogin):Observable<any>{
  //   return this.http.post(`${this.AppUrl}${this.APIUrlLogin}`,user)
  // }
  getUser():Observable<any>{
    return this.http.get(`${this.AppUrl}${this.APIUrlGetUser}`)

  }
  reqPassword(email:string):Observable<any>{
    console.log(this.AppUrl,this.APIUrlReqReset)
    return this.http.post(`${this.AppUrl}${this.APIUrlReqReset}`,{email},{observe:'response'})
  }
  resetPassword(data:any):Observable<any>{
    return this.http.patch(`${this.AppUrl}${this.APIUrlPasswordReset}`,data,{observe:'response'})
  }
  updateUser(data:any):Observable<any>{
    return this.http.patch(`${this.AppUrl}${this.APIUrlUpdateThisUser}`,data)
  }
  loginWithGoogle(token: string): Observable<any> {
    return this.http.post(`${this.AppUrl}auth/google-login`, { token }).pipe(
      tap((response: any) => {
        // Guardamos el usuario completo (que trae los roles) en el storage
        localStorage.setItem('user_data', JSON.stringify(response.userRoles));
        this.userSubject.next(response.userRoles);
      })
    );
  }
}
