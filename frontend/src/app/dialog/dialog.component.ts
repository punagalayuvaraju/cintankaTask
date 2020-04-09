import { Component, OnInit, Inject, Optional } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../_services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  creationForm : FormGroup;
  userinfo:any;
  image:File;

  
  constructor(public userservc:UserService,private spinner:NgxSpinnerService,
    private router:Router,
    @Optional() public dialogRef: MatDialogRef<DialogComponent>,
    public toast: ToastrService,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogdata,
    public formbuilder: FormBuilder
    ) { }

  /**
   *  initially to load child modules
   */
    ngOnInit() {
    this.creationForm = this.formbuilder.group({
      txtarea:[null,Validators.compose([Validators.required])],
      photo:[null, Validators.compose([Validators.required])]
    })

    this.userinfo = null;
    this.userinfo = JSON.parse(localStorage.getItem('currentUser'));
  }


  onFileSelected(fileInput: any) {
    if (fileInput && fileInput.target && fileInput.target.files[0]) {
      this.image = fileInput.target.files[0];
    }
  }
  /**
   *  used for creation of new task
   */

  creationrecord() {
    console.log(this.creationForm.value);
   if (this.creationForm.valid) {
    this.spinner.show();
    const formData: any = new FormData();
    formData.append('uploads',this.image);
    formData.append('data',JSON.stringify( this.creationForm.value));
     this.userservc.createTask(formData).subscribe((data: any) => {
     console.log(data);
     this.spinner.hide();
     if(data && data.success) {
     this.toast.success(data.success);
     this.dialogRef.close(false);
     } else if (data && data.message) {
     this.toast.warning(data.message);
     }

     }, err => {
       this.spinner.hide();
       this.toast.error(err);
     })
   } else {
     this.toast.warning('All the Fields are Required !!!')
   }
  }

  /**
   *  used to handle white spaces in starting
   */

  _handleKeydown(event) {
    if (event.keyCode === 32) {
      event.stopPropagation();
    }
    if (event.which === 32 && event.target.selectionStart === 0) {
      return false;
    }

  }


}
