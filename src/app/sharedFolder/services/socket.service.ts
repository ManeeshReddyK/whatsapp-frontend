import { Injectable } from '@angular/core';
import { ConfigurationService, Configuration } from './configuration.service';
import { LocalStorageService } from 'angular-web-storage';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client'

@Injectable({
    providedIn: 'root'
})
export class SocketService {
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
                this.status(true);
            })

            this.socket.on("error", (error) => {
                observer.error(error);
            })

        })
    }
    sendMessage(receiver, message) {
        this.socket.emit("sendMessage", receiver, message);
    }

    receiveMessageListener() {
        return new Observable((observer) => {
            this.socket.on('receiveMessage', (message) => {
                observer.next(message);
            })
        })
    }

    addUserListener() {
        return new Observable(observer => {
            this.socket.on('addUser', (data) => {
                observer.next(data);
            })
        })
    }

    deleteUserListener() {
        return new Observable((observer) => {
            this.socket.on('deleteUser', (userId) => {
                observer.next(userId);
            })
        })
    }

    isOnlineListener() {
        return new Observable((observer) => {
            this.socket.on('isOnline', (userId) => {
                observer.next(userId);
            })
        })
    }

    isOfflineListener() {
        return new Observable((observer) => {
            this.socket.on('isOffline', (userId) => {
                observer.next(userId);
            })
        })
    }

    userTypingListener() {
        return new Observable((observer) => {
            this.socket.on('userTyping', (userId) => {
                observer.next(userId);
            })
        })
    }

    status(flag) {
        this.socket.emit('status', flag);
    }

    typingStatus(recevierId) {
        this.socket.emit('userTyping', recevierId);
    }

    logout() {
        console.log("closing socket");
        this.socket.emit("leave");
        this.status(false);
    }
}