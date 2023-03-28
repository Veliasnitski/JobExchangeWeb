import { FormGroup } from '@angular/forms';

export function ConfirmPasswordValidator(controlName: string, matchControlName: string) {
    return (fg: FormGroup) => {
        const passwordControl = fg.controls[controlName];
        const confirmPasswordControl = fg.controls[matchControlName];

        if (confirmPasswordControl.errors && confirmPasswordControl.errors['confirmPasswordValidator']){
            return;
        }

        if (passwordControl.value !== confirmPasswordControl.value){
            confirmPasswordControl.setErrors({ confirmPasswordValidator: true})
        } else {
            confirmPasswordControl.setErrors(null)
        }
    }
}