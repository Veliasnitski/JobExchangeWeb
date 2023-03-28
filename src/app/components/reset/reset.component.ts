import { NgToastService } from 'ng-angular-popup';
import  ValidateForm from 'src/app/helpers/validateform';
import { ResetPassword } from './../../models/reset-password.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ConfirmPasswordValidator } from 'src/app/helpers/confirm-password.validator';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPasswordService } from 'src/app/services/reset-password.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  emailToReset!: string;
  emailToken!: string;
  resetPasswordObj = new ResetPassword();

  constructor(private fb: FormBuilder, 
    private router: Router,
    private toast: NgToastService, 
    private activatedRoute: ActivatedRoute, 
    private resetService: ResetPasswordService) {}

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required]
    },{
      validator: ConfirmPasswordValidator("password", "confirmPassword")
    });

    this.activatedRoute.queryParams.subscribe(val => {
      this.emailToReset = val['email'];
      let urlToken = val['code'];
      this.emailToken = urlToken.replace(/ /g,'+');
    });
  }

  reset(){
    if (this.resetPasswordForm.valid){
      this.resetPasswordObj.email = this.emailToReset;
      this.resetPasswordObj.newPassword = this.resetPasswordForm.value.password;
      this.resetPasswordObj.confirmPassword = this.resetPasswordForm.value.confirmPassword;
      this.resetPasswordObj.emailToken = this.emailToken;

      this.resetService.resetPassword(this.resetPasswordObj)
      .subscribe({
        next: (res) => {
          this.toast.success({ detail: "Success", summary: "Password reset successfully", duration: 5000 });
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.toast.error({ detail: "Error", summary: "Something wrong!", duration: 5000 });
        }
      });
    } else {
      ValidateForm.validateAllFormFields(this.resetPasswordForm);
    }
  }

}
