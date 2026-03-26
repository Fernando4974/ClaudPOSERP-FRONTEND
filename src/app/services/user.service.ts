import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { User, UserLogin } from '../interfaces/user';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { SocialAuthService } from '@abacritt/angularx-social-login';

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
  private APIRefreshToken:string;
  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly _AuthService: SocialAuthService,
  ) {
    this.AppUrl=environment.apiUrl;
    this.APIUrlRegister='auth/register'
    this.APIUrlLogin='auth/login'
    this.APIUrlReqReset='auth/recover-password'
    this.APIUrlPasswordReset='auth/password-reset'
    this.APIUrlGetUser='auth/user-update'
    this.APIUrlUpdateThisUser='auth/update-user'
    this.APIRefreshToken='auth/refresh'
  }

   singIn(user:User):Observable<any>{
    return  this.http.post(`${this.AppUrl}${this.APIUrlRegister}`,user)
  }
  Login(user: UserLogin): Observable<any> {
    return this.http.post(`${this.AppUrl}${this.APIUrlLogin}`, user).pipe(
      tap((response: any) => {
        console.log('response;', response)
        // Guardamos el usuario completo (que trae los roles) en el storage
         sessionStorage.setItem('user_data', JSON.stringify(response.userRoles));
         sessionStorage.setItem('user_name', response.nameUser || response.userName || '');
        this.userSubject.next(response.userRoles);
      })
    );
  }
getUserRoles(): string {
  const userData =  sessionStorage.getItem('user_data');
  console.log(userData)
  if (!userData) return 'Role Not Found';


    return userData || 'Role Not Found';


  }

  hasRole(role: string): boolean {
    const userRole =  sessionStorage.getItem('user_data')!;
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
        sessionStorage.setItem('user_data', JSON.stringify(response.userRoles));
        sessionStorage.setItem('user_name', response.nameUser || response.userName || '');
        this.userSubject.next(response.userRoles);
      })
    );
  }
  refreshToken(refreshToken: string): Observable<any>{
    // El backend espera { refresh_token: string } en el body
    return this.http.post(`${this.AppUrl}${this.APIRefreshToken}`, { refresh_token: refreshToken });
  }
  logOut(){
    localStorage.clear()
    sessionStorage.clear()
    this._AuthService.signOut().catch(err=> { throw new Error('logOut Error: ', err) })
    this.router.navigate(['/logIn'])

  };

}
