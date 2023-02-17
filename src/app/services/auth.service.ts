import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string = "https://localhost:44337/api/User/";

  constructor(private http: HttpClient) { }

  signUp(user: any){
    return this.http.post<any>(`${this.baseUrl}register`, user);
  }

  login(user: any){
    return this.http.post<any>(`${this.baseUrl}authenticate`, user);
  }
}
