import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule } from '@angular/forms';
import { AngularWebStorageModule } from 'angular-web-storage';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { ConfigurationService } from './sharedFolder/services/configuration.service';
import { AutoFocusDirective } from './sharedFolder/directives/auto-focus.directive';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    AutoFocusDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularWebStorageModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER, useFactory: (configService: ConfigurationService) => () => { return configService.load() }, deps: [ConfigurationService], multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
