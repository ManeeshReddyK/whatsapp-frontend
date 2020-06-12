import { Injectable } from '@angular/core';
import { ConfigurationService, Configuration } from './configuration.service';
import * as io from 'socket.io-client'
import { SessionStorageService } from 'angular-web-storage';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: "root"
})
export class ApiService {
    socket;
    configuration: Configuration;
    url;

    constructor(
        private configService: ConfigurationService,
        private sessionStorageService: SessionStorageService
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
                    token: this.sessionStorageService.get('token')
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

    logout() {
        console.log("closing socket");
        this.socket.emit("leave");
    }
}