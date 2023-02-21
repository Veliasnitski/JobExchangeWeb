import { AuthService } from './../../services/auth.service';
import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms'
import ValidateForm from 'src/app/helpers/validateform';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash"
  signupForm!: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private auth: AuthService, 
    private router: Router,
    private toast: NgToastService
  ) { }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  hideShowPass(){
    this.isText = !this.isText;
    this.eyeIcon = (this.isText) ? "fa-eye" : "fa-eye-slash";
    this.type = (this.isText) ? "text": "password"; 
  }

  onSignup(){
    if(this.signupForm.valid){
      this.auth.signUp(this.signupForm.value)
        .subscribe({ 
          next: (res) => {
            console.log(res.message);
            this.signupForm.reset();
            this.toast.success({detail: "Success", summary: res.message, duration: 10000});
            this.router.navigate(['login']);
          },
          error: (err) => {
            console.log('Error: ' + err?.error.message);
            this.toast.error({detail: "Error", summary: err?.error.message, duration: 10000});
          }
        });
    } else{
      console.log("Form is not valid");
      // TODO: error
      ValidateForm.validateAllFormFields(this.signupForm);
    }
  }
}
