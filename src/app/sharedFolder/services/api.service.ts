import { Injectable } from '@angular/core';
import { ConfigurationService, Configuration } from './configuration.service';
import * as io from 'socket.io-client'
import { LocalStorageService } from 'angular-web-storage';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: "root"
})
export class ApiService {
    socket;
    configuration: Configuration;
    url;

    constructor(
        private configService: ConfigurationService,
        private localStorageService: LocalStorageService,
        private httpService: HttpClient
    ) {

        this.configuration = this.configService.getConfiguration()
        if (this.configuration.production)
            this.url = this.configuration.url;
        else
            this.url = `${this.configuration.protocol}://${this.configuration.ip}:${this.configuration.port}`;

    }

    initializeSocket() {
        return new Observable((observer) => {

            this.socket = io.connect(this.url, {
                query: {
                    token: this.localStorageService.get('token')
                }
            })

            this.socket.on("connect", () => {
                observer.next();
                this.socket.emit("join");
            })

            this.socket.on("error", (error) => {
                observer.error(error);
            })

        })
    }

    getUserProfile() {
        let headers = new HttpHeaders({ 'Authorization': `Bearer ${this.localStorageService.get('token')}` });
        return new Observable((observer) => {
            this.httpService.get(`${this.url}/api/getUserProfile`, { headers })
                .subscribe(
                    (response: any) => {
                        if (response.success) {
                            console.log(`Response for getUserProfile :`, response);
                            observer.next(response);
                        }
                        else {
                            console.log(`Error in getUserProfile :`, response);
                        }
                    },
                    (error) => {
                        console.log(`Error in getUserProfile :`, error);
                    }
                )
        })
    }

    getUserContacts() {
        let headers = new HttpHeaders({ 'Authorization': `Bearer ${this.localStorageService.get('token')}` });
        return new Observable((observer) => {
            this.httpService.get(`${this.url}/api/getUserContacts`, { headers })
                .subscribe(
                    (response: any) => {
                        if (response.success) {
                            console.log(`Response for getUserContacts :`, response);
                            observer.next(response);
                        }
                        else {
                            observer.error();
                            console.log(`Error in getUserContacts :`, response);
                        }
                    },
                    (error) => {
                        observer.error();
                        console.log(`Error in getUserContacts :`, error);
                    }
                )
        })
    }

    addContact(email) {
        let headers = new HttpHeaders({ 'Authorization': `Bearer ${this.localStorageService.get('token')}` });
        return new Observable(observer => {
            this.httpService.get(`${this.url}/api/addUser/${email}`, { headers })
                .subscribe(
                    (response: any) => {
                        if (response.success) {
                            console.log(`Response for addUser :`, response);
                            observer.next(response);
                        }
                        else {
                            console.log(`Error in addUser :`, response);
                        }
                    },
                    (error) => {
                        console.log(`Error in addUser :`, error);
                    }
                )
        })
    }

    getUserMessages(conversation_Id, email) {
        let headers = new HttpHeaders({ 'Authorization': `Bearer ${this.localStorageService.get('token')}`, 'conversation_Id': conversation_Id });
        return new Observable(observer => {
            this.httpService.get(`${this.url}/api/getUserMessages`, { headers })
                .subscribe(
                    (response: any) => {
                        if (response.success) {
                            console.log(`Response for getUserMessages of ${email}:`, response);
                            observer.next(response);
                        }
                        else {
                            console.log(`Error in getUserMessages of ${email}:`, response);
                        }
                    },
                    (error) => {
                        console.log(`Error in getUserMessages of ${email}:`, error);
                    }
                )
        })

    }

    logout() {
        console.log("closing socket");
        this.socket.emit("leave");
    }
}