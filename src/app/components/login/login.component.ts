import { Component } from '@angular/core';
import { AuthService } from './../../services/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms'
import ValidateForm from 'src/app/helpers/validateform';
import { UserStoreService } from './../../services/user-store.service';
import { Router } from '@angular/router'
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, 
    private auth: AuthService, 
    private router: Router,
    private toast: NgToastService,
    private userStore: UserStoreService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.eyeIcon = (this.isText) ? "fa-eye" : "fa-eye-slash";
    this.type = (this.isText) ? "text": "password"; 
  }

  onLogin() {
    if(this.loginForm.valid){
      console.log(this.loginForm.value);
      this.auth.login(this.loginForm.value)
        .subscribe({
          next: (res) => {
            console.log(res.message);
            this.loginForm.reset();
            this.auth.storeToken(res.accessToken);
            this.auth.storeRefreshToken(res.refreshToken);
            const tokenPayload = this.auth.decodeToken();
            this.userStore.setFullNameForStore(tokenPayload.unique_name);
            this.userStore.setRoleForStore(tokenPayload.role);
            this.toast.success({detail: "Success", summary: res.message, duration: 10000});
            this.router.navigate(['dashboard']);
          },
          error: (err) => {
            this.toast.error({detail: "Error", summary: "Something wrong!", duration: 10000});
            console.log('Error: ' + err?.error.message);
          }
        });
    } else{
      console.log("Form is not valid");
      // TODO: error
      ValidateForm.validateAllFormFields(this.loginForm);
    }
  }
}
