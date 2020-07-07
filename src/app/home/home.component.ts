import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../sharedFolder/services/api.service';
import { LocalStorageService } from 'angular-web-storage';
import { Router } from '@angular/router';
import { NotifyService } from '../sharedFolder/services/notify.service';
import { LastMessageTimePipe } from '../sharedFolder/pipes/lastMessageTime.pipe';
import { element } from 'protractor';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  timeout;
  userInfo;
  userContacts = [];
  selectedUser;
  userMessages;
  searchValue = '';
  @ViewChild('messagesRef') messageRef: ElementRef
  showEmoji: boolean;
  message = '';

  constructor(
    private apiService: ApiService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private notifyService: NotifyService,
    private lastMessageTimePipe: LastMessageTimePipe
  ) { }

  ngOnInit() {
    this.apiService.initializeSocket()
      .subscribe(
        () => {
          console.log("socket connection established");
          this.getUserProfile();
          this.getUserContacts();
          document.addEventListener('visibilitychange', () => {
            this.apiService.status(!document.hidden);
          })

          setInterval(() => {
            this.updateLastMessageTime();
          }, 1000 * 60);

        },
        (error) => {
          console.log("socket connection failed");
          let message = `Websocket : ${error}`;
          this.notifyService.notificationMessage(message, "danger");
          this.clearSession();
        }
      );
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

    this.apiService.receiveMessageListener()
      .subscribe(
        (message: any) => {

          message.messageType = "incoming";
          if (this.selectedUser ? (this.selectedUser.userId.email === message.sender.email) : false) {
            this.userMessages.push(message);
            this.gotoBottomPage();
          }
          else {
            let userIndex = this.userContacts.findIndex((element) => element.userId.email === message.sender.email);
            this.userContacts[userIndex].seen = false;
            this.userContacts[userIndex].messageCount += 1;
          }

          message.lastMessageTimeCreated = this.lastMessageTimePipe.transform(message.time_created);
          this.userContacts.forEach((contact) => {
            if (contact.userId.email === message.sender.email) {
              contact.lastMessage_Id = message;
              if (contact.timerValue) {
                clearTimeout(contact.timerValue);
                contact.typing = false;
                contact.timerValue = undefined;
              }
            }
          });
          this.sortContactList();
        }
      );

    this.apiService.isOnlineListener()
      .subscribe(
        (userId) => {
          this.userContacts.forEach(contact => {
            if (contact.userId._id === userId) {
              contact.userId.status = true;
            }
          });
        }
      );

    this.apiService.isOfflineListener()
      .subscribe(
        (userId) => {
          this.userContacts.forEach(contact => {
            if (contact.userId._id === userId) {
              contact.userId.status = false;
            }
          });
        }
      );

    this.apiService.userTypingListener()
      .subscribe(
        (userId) => {
          console.log(userId);
          this.userContacts.forEach(contact => {
            if (contact.userId._id === userId) {
              contact.typing = true;
              if (contact.timerValue) {
                clearTimeout(contact.timerValue);
                contact.timerValue = undefined;
              }
              let timerValue = setTimeout(() => {
                contact.typing = false;
              }, 3000);
              contact.timerValue = timerValue;
            }
          });
        }
      )

    this.apiService.addUserListener()
      .subscribe(
        (data: any) => {
          console.log('addUser:', data);
          let element = data;
          element.seen = true;
          element.messageCount = 0;
          element.typing = false;
          this.userContacts.push(element);
        }
      )

    this.apiService.deleteUserListener()
      .subscribe(
        (userId) => {
          this.userContacts = this.userContacts.filter(element => element.userId._id !== userId);
          if (this.selectedUser && this.selectedUser.userId._id === userId) {
            this.selectedUser = undefined;
            this.userMessages = [];
          }
        }
      )


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
          this.userContacts = response.data.map((element) => {
            element.seen = true;
            element.messageCount = 0;
            element.typing = false;
            if (element.lastMessage_Id)
              element.lastMessage_Id.lastMessageTimeCreated = this.lastMessageTimePipe.transform(element.lastMessage_Id.time_created);
            return element;
          });
          this.sortContactList();
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
          let element = response.data;
          element.seen = true;
          element.messageCount = 0;
          element.typing = false;
          this.userContacts.push(element);
        }
      )
  }

  deleteContact() {
    let userId = this.selectedUser.userId._id;
    this.apiService.deleteContact(userId)
      .subscribe(
        () => {
          this.userContacts = this.userContacts.filter(element => element.userId._id !== userId);
          if (this.selectedUser && userId === this.selectedUser.userId._id) {
            this.selectedUser = undefined;
            this.userMessages = [];
          }
        }
      )
  }

  getUserMessages(contact, i) {
    this.userContacts[i].seen = true;
    this.userContacts[i].messageCount = 0;
    this.selectedUser = contact;
    this.userMessages = [];
    this.apiService.getUserMessages(contact.conversation_Id, contact.userId.email)
      .subscribe(
        (response: any) => {
          this.userMessages = response.data.map(element => {
            element.messageType = element.sender.email === this.userInfo.email ? "outgoing" : "incoming";
            return element;
          });
          this.gotoBottomPage();
        },
        () => {
          this.userMessages = [];
        }
      )
  }

  sendMessage(form) {
    let message: any = {
      sender: {
        email: this.userInfo.email
      },
      content: form.value.message,
      content_type: "message",
      time_created: new Date().getTime(),
      conversation_Id: this.selectedUser.conversation_Id
    }
    this.apiService.sendMessage(this.selectedUser.userId._id, message);
    message.messageType = "outgoing";
    this.userMessages.push(message);
    this.gotoBottomPage();
    message.lastMessageTimeCreated = this.lastMessageTimePipe.transform(message.time_created);
    this.userContacts.forEach((contact) => {
      if (contact.userId._id === this.selectedUser.userId._id) {
        contact.lastMessage_Id = message;
      }
    });
    this.sortContactList();

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

  gotoBottomPage() {
    setTimeout(() => {
      this.messageRef.nativeElement.scrollTop = this.messageRef.nativeElement.scrollHeight;
    }, 0)
  }

  updateLastMessageTime() {
    this.userContacts = this.userContacts.map(element => {
      if (element.lastMessage_Id) {
        element.lastMessage_Id.lastMessageTimeCreated = this.lastMessageTimePipe.transform(element.lastMessage_Id.time_created);
      }
      return element;
    })
  }

  sortContactList() {
    this.userContacts.sort((a, b) => {
      a = new Date(a.lastMessage_Id ? a.lastMessage_Id.time_created : null).getTime();
      b = new Date(b.lastMessage_Id ? b.lastMessage_Id.time_created : null).getTime();
      return b - a;
    });
  }

  searchValueChange() {
    this.selectedUser = undefined;
    this.userMessages = [];
  }

  userTyping() {
    this.apiService.typingStatus(this.selectedUser.userId._id);
  }

  showEmojiMethod(type) {
    if (type === 'icon')
      this.showEmoji = !this.showEmoji;
    else
      this.showEmoji = false;
  }

  addEmoji(event) {
    if (!this.message)
      this.message = '';
    this.message += event.emoji.native;
    this.userTyping();
  }

  onBackArrow() {
    this.selectedUser = undefined;
    this.userMessages = [];
  }
}
