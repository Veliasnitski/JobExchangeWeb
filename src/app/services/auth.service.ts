import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import {JwtHelperService} from '@auth0/angular-jwt'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string = "https://localhost:44337/api/User/";
  private userPayload: any;

  constructor(private http: HttpClient, private router: Router) { 
    this.userPayload = this.decodeToken();
  }

  signUp(user: any){
    console.log(user);
    return this.http.post<any>(`${this.baseUrl}register`, user);
  }

  signOut(){
    localStorage.clear();
   // localStorage.removeItem('token');
    this.router.navigate(['login']);
  }

  login(user: any){
    return this.http.post<any>(`${this.baseUrl}authenticate`, user);
  }

  storeToken(tokenValue: string){
    localStorage.setItem('token', tokenValue);
  }

  getToken(){
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean{
    return !!localStorage.getItem('token');
  }

  decodeToken(){
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!;

    return jwtHelper.decodeToken(token);
  }

  getFullNameFromToken(){
    if (this.userPayload)
      return  this.userPayload.unique_name;
  }

  getRoleNameFromToken(){
    if (this.userPayload)
      return  this.userPayload.role;
  }
}
