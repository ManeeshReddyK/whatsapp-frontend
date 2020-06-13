import { Injectable } from '@angular/core';
import { ConfigurationService, Configuration } from './configuration.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    url;
    configuration: Configuration

    constructor(
        private configService: ConfigurationService,
        private httpService: HttpClient
    ) {

        this.configuration = this.configService.getConfiguration()
        if (this.configuration.production)
            this.url = this.configuration.url;
        else
            this.url = `${this.configuration.protocol}://${this.configuration.ip}:${this.configuration.port}`;

    }

    login(body) {

        return this.httpService.post(`${this.url}/auth/login`, body);

    }

    register(body) {

        return this.httpService.post(`${this.url}/auth/register`, body);

    }

    validateToken(token) {
        let headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        return this.httpService.get(`${this.url}/auth/validateToken`, { headers })
    }
}
