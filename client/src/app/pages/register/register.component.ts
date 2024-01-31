import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import{ConfirmPasswordValidator} from'../../validators/confirmPassword.validator';
import { AuthService } from 'src/app/services/auth.service';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export default class RegisterComponent {  
  fb= inject(FormBuilder);
  authService =inject(AuthService);
  router =inject(Router);

  registerForm !: FormGroup;

  ngOnInit():void{
    this.registerForm=this.fb.group({
    FirstName: ['',Validators.required],
    LastName: ['',Validators.required],
    email: ['',Validators.compose([Validators.required,Validators.email])],
    Username: ['',Validators.required],
    password: ['',Validators.required],
    ConfirmPassword: ['',Validators.required]
    },
    {
      validator: ConfirmPasswordValidator('password','ConfirmPassword')
    });

  }
  register(){
    this.authService.registerService(this.registerForm.value)
    .subscribe({
      next:(res)=>{
        alert("User Created !");
        this.registerForm.reset();
        this.router.navigate(['login'])

      },
      error:(err)=>{
        console.log(err);
      }
    })
  }
}
