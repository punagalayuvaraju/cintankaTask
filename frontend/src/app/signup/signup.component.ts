import { Component, OnInit } from '@angular/core';
import {FormGroup,FormBuilder, Validators} from '@angular/forms'
import { UserService } from '../_services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  registerForm:FormGroup;
  passwordtype = 'password'; // ---------------It is declared for initial condition for show password value---------------//
  showPass = false; // ---------------used for onclick change show password---------------//
  
  
  constructor(private formbuilder: FormBuilder, private usersrvc: UserService,private router:Router
    ,private spinner:NgxSpinnerService, private toast:ToastrService) { }

  /**
   *  used for initializing the child modules
   */
  ngOnInit(): void {
    this.registerForm = this.formbuilder.group({
      firstname: [null,Validators.compose([Validators.required,Validators.pattern(/[a-z A-Z]{3,45}/)])],
      lastname: [null,Validators.compose([Validators.required,Validators.pattern(/[a-z A-Z]{3,45}/)])],
      username: [null,Validators.compose([Validators.required,Validators.pattern(/[a-z A-Z]{3,45}/)])],
      password: [null,Validators.compose([Validators.required,Validators.pattern(/^(?!.* )(?=.*\d)(?=.*[A-Z])(?=.*?[@_.]).{8,15}$/)])]
    });
  }

  /**
   *  used for form validation purpose
   */
  get formControls() { return this.registerForm.controls; }

  /**
   *  used for registration of new User
   */
  registerUser(event) {
    const userip = JSON.parse(localStorage.getItem('SmartIp'));
    this.registerForm.value.userIP = userip.ip;
    console.log(this.registerForm.value);
        if( this.registerForm.valid) {
          event.stopPropagation();
      this.spinner.show();
        this.usersrvc.createUser(this.registerForm.value).subscribe((data: any) => {
        console.log(data);
        this.spinner.hide();
        if (data && data.userrole && data.token) {
          this.toast.success('User Registered Successfully !!!');
          localStorage.setItem('currentUser',JSON.stringify(data));
           this.router.navigate(['home']);
        } 
      },err => {
        console.log(err);
        this.spinner.hide();
        this.toast.error(err);
      })
    }
  }


  /**
   *  used to handle white spaces 
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
