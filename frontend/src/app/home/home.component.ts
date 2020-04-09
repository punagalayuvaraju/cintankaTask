import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment'
import { FrontEndConfig } from '../frontendConfig';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userinfo:any;
  usersTasks = [];
  AllComments = [];
  openComments= false;
  serverurl = this.frontendconfig.getserverurl();
  commentForm: FormGroup;


  constructor( public toast: ToastrService,public frontendconfig: FrontEndConfig,
    public userservc:UserService,public dialog : MatDialog, public formbuilder:FormBuilder,
    private spinner:NgxSpinnerService,private router:Router) { }

  /**
   *  initially to load child modules
   */

  ngOnInit() {
   this.commentForm = this.formbuilder.group({
    comment:[null,Validators.compose([Validators.required])],
   })

    this.userinfo = null;
    this.userinfo = JSON.parse(localStorage.getItem('currentUser'));
    console.log(this.userinfo);
    this.startup();

    const obj = {
      type:'connect',
      username:this.userinfo.username
    }
    this.userservc.Connectsocket(obj);
    this.userservc.taskAnyNew().subscribe((data: any) => {
      console.log(data)
      if (data && data.username === this.userinfo.username) {

      }else {
        this.toast.success('New Post Created by' +' '+ data.firstname);
        this.startup();
      }
    })
  }

  /**
   *  used for logout of application
   */
  logout(event) {
    event.stopPropagation();
    const obj = {
      type:'disconnect',      
      username:this.userinfo.username
    }
    this.userservc.Connectsocket(obj);
    this.userservc.logout();
  }

  /**
   *  opens dialog for Task Creation
   */
  createTaskList() {
    let dialogRef = this.dialog.open(DialogComponent, {
      height:'auto',
      width:'auto',
      data:{type:'create'},
      disableClose:true
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result === false) {
        this.startup();
      }
    });
  }

// comments creation
  commentSuccess(i){
   if(this.commentForm.valid) {
     this.commentForm.value.postID = i._id;
     console.log(this.commentForm.value)
     this.userservc.createComment(this.commentForm.value).subscribe((data: any) => {
     console.log(data);
     if (data && data.message === 'Success') {
       this.getComments(i);
       this.commentForm.reset();
     }
     }, err => {
      this.toast.error(err);
     })
   }
  }


// get comments for particular post

getComments(i) {
  this.userservc.getPartComments(i._id).subscribe((data: any) => {
   console.log(data);
   this.AllComments = [];
   this.AllComments = data[0];
  },err => {
    this.toast.error(err);
  })
}

  // Handles the key down event with MatSelect.
  // Allows e.g. selecting with enter key, navigation with arrow keys, etc.
  // @param {KeyboardEvent} event
  // @private */

  _handleKeydown(event) {
    // tslint:disable-next-line: deprecation
    if (event.keyCode === 32) {
      // do not propagate spaces to MatSelect, as this would select the currently active option
      event.stopPropagation();
    }
    if (event.which === 32 && event.target.selectionStart === 0) {
      return false;
    }

  }

  /**
   *  used for initializing logged in user tasks
   */
  startup() {
    this.spinner.show();
    this.userservc.getUserTasks().subscribe((data: any) => {
    this.usersTasks = [];
    this.usersTasks = data;
    console.log(this.usersTasks);
    this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.toast.error(err);
    })
  }

  

 
}
