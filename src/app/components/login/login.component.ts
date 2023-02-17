import { AuthService } from './../../services/auth.service';
import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms'
import ValidateForm from 'src/app/helpers/validateform';
import { Router } from '@angular/router';
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
    private toast: NgToastService
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
