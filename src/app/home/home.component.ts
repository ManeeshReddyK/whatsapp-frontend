import { Component, OnInit } from '@angular/core';
import { ApiService } from '../sharedFolder/services/api.service';
import { LocalStorageService } from 'angular-web-storage';
import { Router } from '@angular/router';
import { NotifyService } from '../sharedFolder/services/notify.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  timeout;
  userInfo;
  userContacts;
  selectedUser;
  userMessages;

  constructor(
    private apiService: ApiService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private notifyService: NotifyService
  ) { }

  ngOnInit() {
    this.apiService.initializeSocket()
      .subscribe(
        () => {
          console.log("socket connection established");
          this.getUserProfile();
          this.getUserContacts();
        },
        (error) => {
          console.log("socket connection failed");
          let message = `Websocket : ${error}`;
          this.notifyService.notificationMessage(message, "danger");
          this.clearSession();
        }
      )
    let expireDate = this.localStorageService.get('expiredate');
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

  getUserProfile() {
    this.apiService.getUserProfile()
      .subscribe(
        (response: any) => {
          this.userInfo = response.data;
        }
      )
  }

  getUserContacts() {
    this.apiService.getUserContacts()
      .subscribe(
        (response: any) => {
          this.userContacts = response.data;
        },
        () => {
          this.userContacts = [];
        }
      )
  }

  addContact(form) {
    this.apiService.addContact(form.value.email)
      .subscribe(
        (response: any) => {
          this.userContacts.push(response.data);
        }
      )
  }

  getUserMessages(contact) {
    this.selectedUser = undefined;
    setTimeout(() => {
      this.selectedUser = contact.userId._id;
    }, 0)
    this.userMessages = [];
    this.apiService.getUserMessages(contact.conversation_Id, contact.userId.email)
      .subscribe(
        (response: any) => {
          this.userMessages = response.data;
        },
        () => {
          this.userMessages = [];
        }
      )
  }

  clearSession() {
    this.localStorageService.clear();
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
