import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotifyService } from '../sharedFolder/services/notify.service';
import { AuthService } from '../sharedFolder/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private router: Router,
    private authService: AuthService,
    private notifyService: NotifyService) { }

  ngOnInit() {
  }

  register(form) {
    let email = form.value.email;
    let password = form.value.password;
    let body = {
      email, password
    }

    this.authService.register(body)
      .subscribe(
        (responseData) => {
          if (responseData['success']) {
            this.notifyService.notificationMessage(responseData['message'], 'success');
            this.router.navigate(["login"]);
          }
          else {
            this.notifyService.notificationMessage(responseData['message'], 'danger');
          }
        },
        (error) => {
          this.notifyService.notificationMessage("Error", 'danger');
          console.log('error :', error);
        }
      )
  }

}
