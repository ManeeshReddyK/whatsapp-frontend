import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from 'angular-web-storage';
import { AuthService } from '../services/auth.service';
import { elementStyleProp } from '@angular/core/src/render3';

@Injectable({
    providedIn: 'root'
})
export class LoginRequiredGuard implements CanActivate {

    constructor(
        private localStorageService: LocalStorageService,
        private router: Router,
        private authService: AuthService
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        return new Observable((observer) => {

            let token = this.localStorageService.get('token');

            if (route.data.route === "login" || route.data.route === "register") {

                if (!token) {
                    observer.next(true);
                }
                else {
                    observer.error(false);
                    console.log(`token found`);
                    this.router.navigate(['home']);
                }

            }
            else {

                this.authService.validateToken(token)
                    .subscribe(
                        (response: any) => {
                            if (response.success) {
                                observer.next(true)
                            }
                            else {
                                observer.error(false);
                                console.log(`token is invalid`);
                                this.router.navigate(['login']);
                            }
                        },
                        (error) => {
                            observer.error(false);
                            console.log(`token is invalid due to server error`);
                            this.router.navigate(['login']);
                        }
                    )

            }
        });
    }
}
