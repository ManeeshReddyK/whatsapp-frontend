import { Injectable, EventEmitter } from '@angular/core';
import { ConfigurationService, Configuration } from './configuration.service';
import { LocalStorageService } from 'angular-web-storage';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NotifyService } from './notify.service';

@Injectable({
    providedIn: "root"
})
export class ApiService {
    configuration: Configuration;
    url;
    userImageChanged = new Subject<String>();

    constructor(
        private configService: ConfigurationService,
        private localStorageService: LocalStorageService,
        private httpService: HttpClient,
        private notifyService: NotifyService
    ) {

        this.configuration = this.configService.getConfiguration()
        if (this.configuration.production)
            this.url = this.configuration.url;
        else
            this.url = `${this.configuration.protocol}://${this.configuration.ip}:${this.configuration.port}`;

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
                            this.notifyService.openSnackBar(response.message, "Success");
                        }
                        else {
                            console.log(`Error in addUser :`, response);
                            this.notifyService.openSnackBar(response.message, "Error");
                        }
                    },
                    (error) => {
                        console.log(`Error in addUser :`, error);
                        this.notifyService.openSnackBar(error.message, "Error");
                    }
                )
        })

    }

    deleteContact(userId) {

        let headers = new HttpHeaders({ 'Authorization': `Bearer ${this.localStorageService.get('token')}` });
        return new Observable(observer => {
            this.httpService.delete(`${this.url}/api/deleteUser/${userId}`, { headers })
                .subscribe(
                    (response: any) => {
                        if (response.success) {
                            console.log(`Response for deleteContact :`, response);
                            this.notifyService.openSnackBar(response.message, "Success");
                            observer.next();
                        }
                        else {
                            console.log(`Error in deleteContact :`, response);
                            this.notifyService.openSnackBar(response.message);
                        }
                    },
                    (error) => {
                        console.log(`Error in deleteContact :`, error);
                        this.notifyService.openSnackBar(error.message);
                    }
                )
        })

    }

    deactivateAccount() {

        let headers = new HttpHeaders({ 'Authorization': `Bearer ${this.localStorageService.get('token')}` });
        return new Observable(observer => {
            this.httpService.delete(`${this.url}/api/deactivateAccount`, { headers })
                .subscribe(
                    (response: any) => {
                        if (response.success) {
                            console.log(`Response for deactivateAccount :`, response);
                            observer.next();
                            this.notifyService.openSnackBar(response.message, "Success");
                        }
                        else {
                            console.log(`Error in deactivateAccount :`, response);
                            this.notifyService.openSnackBar(response.message);
                        }
                    },
                    (error) => {
                        console.log(`Error in deactivateAccount :`, error);
                        this.notifyService.openSnackBar(error.message);
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

    userImageUpload(file: File) {

        let headers = new HttpHeaders({ 'Authorization': `Bearer ${this.localStorageService.get('token')}` });

        let fileType = file.type.split('/')[1];

        return new Observable(observer => {
            this.httpService.get(`${this.url}/api/urlForUserProfile?type=${fileType}`, { headers })
                .subscribe(
                    (response: any) => {
                        if (response.success) {
                            this.httpService.put(`${response.url}`, file)
                                .subscribe(awsResponse => {
                                    console.log(awsResponse);
                                    this.httpService.put(`${this.url}/api/userProfileImage`, { key: response.key }, { headers })
                                        .subscribe((data: any) => {
                                            if (data.success) {
                                                this.notifyService.openSnackBar(data.message, "Success");
                                                observer.next(data);
                                            }
                                            else {
                                                console.log(`Error in userImageUpload:`, data.message);
                                                this.notifyService.openSnackBar("Error in Uploading Image", "Error");
                                                observer.error();
                                            }
                                        }, error => {
                                            console.log(`Error in userImageUpload:`, error);
                                            this.notifyService.openSnackBar(error.message, "Error");
                                            observer.error();
                                        })
                                }, error => {
                                    console.log(`Error in userImageUpload:`, error);
                                    this.notifyService.openSnackBar("Error in Uploading Image", "Error");
                                    observer.error();
                                })
                        }
                        else {
                            this.notifyService.openSnackBar(response.message, "Error");
                            observer.next();
                        }
                    },
                    (error) => {
                        console.log(`Error in userImageUpload:`, error);
                        this.notifyService.openSnackBar(error.message, "Error");
                        observer.next();
                    }
                )
        })
    }
}