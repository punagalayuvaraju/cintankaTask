import { Component } from '@angular/core';
import {Router} from '@angular/router';
import { FrontEndConfig } from './frontendConfig';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'testproject';
  serverurl:any;
  constructor(private router:Router ,private frontendconfig:FrontEndConfig) {
  this.findIP();
  this.serverurl = this.frontendconfig.getfrontendurl();
  const storage = localStorage.getItem('currentUser');
  if (storage) {
    const loc = window.location.href.replace(this.serverurl, '');
    console.log(loc);
    if (loc === '/') {
      this.router.navigate(['home']);
    } else {
      this.router.navigateByUrl(loc);
    }
  } else {
    this.router.navigate(['/']);
  }
  }

  findIP() {
    // get public ip
    const path = 'https://api.ipify.org?format=json';
    const xhrr = new XMLHttpRequest();
    xhrr.open('GET', path);
    xhrr.responseType = 'json';
    // tslint:disable-next-line:only-arrow-functions
    xhrr.onload = function() {
      console.log(typeof (xhrr.response));
      if (typeof (xhrr.response) !== 'object') {
        localStorage.removeItem('SmartIp');
        localStorage.setItem('SmartIp', JSON.stringify(JSON.parse(xhrr.response)));
      } else {
        localStorage.setItem('SmartIp', JSON.stringify(xhrr.response));
      }
    };
    xhrr.send();
  }
}
