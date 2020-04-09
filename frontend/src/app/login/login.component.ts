import { Component, OnInit } from '@angular/core';
import {FormGroup,FormBuilder, Validators} from '@angular/forms'
import { UserService } from '../_services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  passwordtype = 'password'; // ---------------It is declared for initial condition for show password value---------------//
  showPass = false; // ---------------used for onclick change show password---------------//
 
 
  constructor(private formbuilder: FormBuilder, private usersrvc: UserService,private router:Router
  ,private spinner:NgxSpinnerService, private toast:ToastrService) { }

  /**
   *  used for initializing child modules
   */
  ngOnInit() {
   this.loginForm = this.formbuilder.group({
    username: [null,Validators.compose([Validators.required,Validators.pattern(/[a-z A-Z]{3,45}/)])],
    password: [null,Validators.compose([Validators.required,Validators.pattern(/^(?!.* )(?=.*\d)(?=.*[A-Z])(?=.*?[@_.]).{8,15}$/)])]
   })
  }

   /**
   *  used for form validations
   */
  get formControls() { return this.loginForm.controls; }

  /**
   *  used for checking the login credentials
   */
  loginUser(event) {
  if(this.loginForm.valid) {
    event.stopPropagation();
    this.spinner.show();
    this.usersrvc.userLogin(this.loginForm.value).subscribe((data: any) => {
      console.log(data);
      this.spinner.hide();
      if (data && data.userrole && data.token) {
        this.toast.success('Logged In Successfully !!!');
        localStorage.setItem('currentUser',JSON.stringify(data));
         this.router.navigate(['home']);
      }
    }, err => {
      this.toast.warning(err)
      this.spinner.hide();
    })
  }
  }

  /**
   *  used to prevent white spaces for the first letter
   */
  _handleKeydown(event) {
    if (event.keyCode === 32) {
      event.stopPropagation();
    }
    if (event.which === 32 && event.target.selectionStart === 0) {
      return false;
    }

  }

  
    /*** input:none;*
   *    output:displays password value*/
  // -------------------------function called for Show password-------------//
  hideShowPassword() {
    this.showPass = !this.showPass;
    console.log(this.showPass);
    if (this.showPass) {
      this.passwordtype = 'text';
    } else {
      this.passwordtype = 'password';
    }
  }
  
}
