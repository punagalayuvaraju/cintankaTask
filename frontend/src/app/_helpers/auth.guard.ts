import { Injectable } from '@angular/core';
import { Router, CanActivate,ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../_services/user.service';
import { ToastrService } from 'ngx-toastr';
@Injectable()
export class AuthGuardService implements CanActivate {
  isActiveuser: any;
  constructor(public toast: ToastrService, public auth: UserService, public router: Router) {}
  canActivate(): boolean {
    this.isActiveuser = this.auth.isAuthenticated();
    if (this.isActiveuser === null) {
      this.toast.error('Session Expired !!! Please Login !!!');
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
