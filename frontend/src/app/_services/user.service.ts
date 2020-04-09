import { Injectable, EventEmitter} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FrontEndConfig } from '../frontendConfig';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as socketIo from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  serverurl = this.frontendconfig.getserverurl();
  observer: any;
  socketio: Socket;

  constructor(
    public http: HttpClient,
    public frontendconfig: FrontEndConfig,
    public router: Router,
    public toast: ToastrService
    ) { }

    public isAuthenticated() {
      const token = JSON.parse(localStorage.getItem('currentUser'));
      // Check whether the token is expired and return
      // true or false
      return token;
    }

    // user login authentication
    userLogin(loginData) { return this.http.post(this.serverurl + '/auth/local', loginData); }

    // user logout related
    logout() { 
      localStorage.removeItem('currentUser');
      this.router.navigate(['']); 
     }
    
    // New user registeration
    createUser(user) {return this.http.post(this.serverurl + '/api/users/', user);}

    // New task creation
    createTask(task) {return this.http.post(this.serverurl + '/api/posts/', task); }

    // get logged in user tasks && logged in user Expired tasks
    getUserTasks() {return this.http.get(this.serverurl + '/api/posts/'); }
   
    // creates comment in db
    createComment(comment) { return this.http.post(this.serverurl + '/api/comments/', comment);}  
    
    // get comments for particular post
    getPartComments(id) { return this.http.get(this.serverurl + '/api/posts/'+id);}

// socket configuration //////////////////////////////////////

    taskAnyNew() {
      const observable = new Observable<any>(observer => {
        this.socketio.on('task:save', (data) => {
          observer.next(data);
        });
      });
      return observable;
    }
  
    // Socket connection
    Connectsocket(type): Observable<number> {
      this.observer = new Observable();
      if (type.type === 'connect') {
        this.socketio = socketIo(this.serverurl);
        this.socketio.emit('info', type.username);
      }
      if (type.type === 'disconnect') {
        this.socketio.emit('onDisconnect','');
      }
      return this.createObservable();
    }
    // create an observerable
    createObservable(): Observable<number> {
      return new Observable<number>(observer => {
        this.observer = observer;
      });
    }
  
 
}
export interface Socket {
  _callbacks: any;
  on(event: string, callback: (data: any) => void );
  emit(event: string, data: any);
  disconnect();
  removeAllListeners(event: string);
}