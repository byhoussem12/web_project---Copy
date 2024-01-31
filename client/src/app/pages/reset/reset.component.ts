import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmPasswordValidator } from 'src/app/validators/confirmPassword.validator';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reset',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export default class ResetComponent {
  resetForm!:FormGroup;
  fb=inject(FormBuilder);
  activatedRoute=inject(ActivatedRoute);
  router= inject(Router);
  authService= inject(AuthService)
  token!: string;
  ngOnInit():void{
    this.resetForm=this.fb.group({
      password: ['',Validators.required],
      ConfirmPassword: ['',Validators.required] 
   },
    {
      validator: ConfirmPasswordValidator('password','ConfirmPassword')
    }
    )

   this.activatedRoute.params.subscribe(val=>{
      this.token=val['token'];
      console.log(this.token)
    })
  }
  reset(){
    let resetObj={
      token:this.token,
      password :this.resetForm.value.password
    }
    this.authService.resetPasswordService(resetObj)
    .subscribe({
      next:(res)=>{
        alert(res.message);
        this.resetForm.reset();
        this.router.navigate(['login'])
      },
      error: (err)=>{
        alert(err.error)
      }
    })

  }

}
