import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { LoginRequiredGuard } from './sharedFolder/guards/loginRequiredGuard.guard';

const routes: Routes = [
    {
        path: "login",
        canActivate: [LoginRequiredGuard],
        data: { route: "login" },
        component: LoginComponent
    },
    {
        path: "register",
        canActivate: [LoginRequiredGuard],
        data: { route: "register" },
        component: RegisterComponent
    },
    {
        path: "home",
        canActivate: [LoginRequiredGuard],
        data: { route: "home" },
        component: HomeComponent
    },
    {
        path: "",
        pathMatch: "full",
        redirectTo: "login"
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
