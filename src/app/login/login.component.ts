import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-web-storage';
import { AuthService } from '../sharedFolder/services/auth.service';
import { NotifyService } from '../sharedFolder/services/notify.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router,
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private notifyService: NotifyService) { }

  ngOnInit() {
  }

  login(form) {
    let email = form.value.email;
    let password = form.value.password;
    let body = {
      email, password
    }

    this.authService.login(body)
      .subscribe(
        responseData => {
          if (responseData['success']) {
            let expiredate = new Date(new Date().getTime() + (60 * 60 * 1000));
            this.notifyService.notificationMessage(responseData['message'], 'success');
            this.localStorageService.set('token', responseData['token'], 1, 'h');
            this.localStorageService.set('email', email, 1, 'h');
            this.localStorageService.set('expiredate', expiredate.toString());
            this.router.navigate(["home"]);
          }
          else {
            this.notifyService.notificationMessage(responseData['message'], 'danger');
            this.router.navigate(["register"]);
          }
        },
        (error) => {
          this.notifyService.notificationMessage("Error", 'danger');
          console.log('error :', error);
        }
      )
  }

}
