import { NgToastService } from 'ng-angular-popup';
import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router, private toats: NgToastService){

  }

  canActivate(): boolean
  {
    if (this.auth.isLoggedIn()){
      return true;
    } else{
      this.toats.error({detail: "Error", summary: "Please login first!"});
      this.router.navigate(['login']);
      return false;
    }
  }  
}
