import { FormGroup} from '@angular/forms';

export const ConfirmPasswordValidator=( controlName: string ,controlNameToMatch :string )=>{
    return  (formGroup: FormGroup )=>{
        let control = formGroup.controls[controlName];
        let controlToMatch = formGroup.controls[controlNameToMatch];
        if (controlToMatch.errors && !controlToMatch.errors['ConfirmPasswordValidator']) {
            return;
        }
        if (control.value != controlToMatch.value) {
            controlToMatch.setErrors({ ConfirmPasswordValidator: true });
        }
        else {
            controlToMatch.setErrors(null);
        }
    }
}