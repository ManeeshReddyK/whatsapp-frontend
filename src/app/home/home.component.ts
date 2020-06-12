import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { SessionStorageService } from 'angular-web-storage';
import { Router } from '@angular/router';
import { NotifyService } from '../services/notify.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  timeout;

  constructor(
    private apiService: ApiService,
    private sessionStorageService: SessionStorageService,
    private router: Router,
    private notifyService: NotifyService
  ) { }

  ngOnInit() {
    this.apiService.initializeSocket()
      .subscribe(
        () => {
          console.log("socket connection established");
        },
        (error) => {
          console.log("socket connection failed");
          let message = `Websocket : ${error}`;
          this.notifyService.notificationMessage(message, "danger");
          this.clearSession();
        }
      )
    let expireDate = this.sessionStorageService.get('expiredate');
    let remainingTime = new Date(expireDate).getTime() - new Date().getTime();

    if (remainingTime > 0) {
      this.timeout = setTimeout(() => {
        this.logout();
      }, remainingTime);
    }
    else {
      this.clearSession();
    }
  }

  clearSession() {
    this.sessionStorageService.clear();
    this.router.navigate(['login']);
  }

  logout() {
    this.apiService.logout();
    this.clearSession();
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeout)
  }
}
