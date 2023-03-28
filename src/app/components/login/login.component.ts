import { Component } from '@angular/core';
import { AuthService } from './../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import ValidateForm from 'src/app/helpers/validateform';
import { UserStoreService } from './../../services/user-store.service';
import { Router } from '@angular/router'
import { NgToastService } from 'ng-angular-popup';
import { ResetPasswordService } from 'src/app/services/reset-password.service';

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
  public resetPasswordEmail!: string;
  public isValidEmail!: boolean;

  constructor(private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: NgToastService,
    private userStore: UserStoreService,
    private resetService: ResetPasswordService
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
    this.type = (this.isText) ? "text" : "password";
  }

  onLogin() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      this.auth.login(this.loginForm.value)
        .subscribe({
          next: (res) => {
            this.loginForm.reset();
            this.auth.storeToken(res.accessToken);
            this.auth.storeRefreshToken(res.refreshToken);
            const tokenPayload = this.auth.decodeToken();
            this.userStore.setFullNameForStore(tokenPayload.unique_name);
            this.userStore.setRoleForStore(tokenPayload.role);
            this.toast.success({ detail: "Success", summary: res.message, duration: 10000 });
            this.router.navigate(['dashboard']);
          },
          error: (err) => {
            this.toast.error({ detail: "Error", summary: "Something wrong!", duration: 10000 });
            console.log('Error: ' + err?.error.message);
          }
        });
    } else {
      console.log("Form is not valid");
      // TODO: error
      ValidateForm.validateAllFormFields(this.loginForm);
    }
  }

  checkValidEmail(event: string) {
    const value = event;
    const pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    this.isValidEmail = pattern.test(value);

    return this.isValidEmail;
  }

  confirmToSend(){
    if(this.checkValidEmail(this.resetPasswordEmail)){
      // API send
      this.resetService.sendResetPasswordLink(this.resetPasswordEmail)
      .subscribe({
        next:(res)=>{
          this.toast.success({ detail: "Success", summary: 'Reset Success', duration: 5000 });
          this.resetPasswordEmail = "";
          const closeBtn = document.getElementById("closeBtn");
          closeBtn?.click();
        },
        error:(err)=>{
          this.toast.error({ detail: "Error", summary: "Something wrong!", duration: 5000 });
        }
      });
    }
  }
}
