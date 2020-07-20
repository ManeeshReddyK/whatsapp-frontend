import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';

export interface Configuration {
    production: boolean,
    url: String,
    protocol: String,
    ip: String,
    port: Number
}

@Injectable({
    providedIn: "root"
})
export class ConfigurationService {

    configuration: Configuration;

    constructor(private httpClientService: HttpClient) {

    }
    load() {
        return new Promise((resolve, reject) => {
            this.httpClientService.get('assets/configuration/config.json')
                .subscribe(
                    (response: Configuration) => {
                        this.setConfiguration(response);
                        resolve();
                    },
                    (error) => {
                        console.log('error in reading configuration :>> ', error);
                        reject();
                    }
                )
        })
    }

    setConfiguration(response: Configuration) {
        this.configuration = response;
        if (response.production) {
            console.log = () => { };
        }
    }

    getConfiguration() {
        return this.configuration;
    }
}