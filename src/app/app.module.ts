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
import { HeaderComponent } from './header/header.component';
import { LastMessageTimePipe } from './sharedFolder/pipes/lastMessageTime.pipe';
import { SearchPipe } from './sharedFolder/pipes/search.pipe';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './sharedFolder/modules/material.module';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material';
import { AddcontactComponent } from './sharedFolder/modals/addcontact/addcontact.component';
import { DeactivateaccountComponent } from './sharedFolder/modals/deactivateaccount/deactivateaccount.component';
import { ProfileComponent } from './sharedFolder/modals/profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    AutoFocusDirective,
    HeaderComponent,
    SearchPipe,
    AddcontactComponent,
    DeactivateaccountComponent,
    ProfileComponent,
    LastMessageTimePipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    AngularWebStorageModule,
    HttpClientModule,
    PickerModule,
    MaterialModule
  ],
  providers: [
    LastMessageTimePipe,
    {
      provide: APP_INITIALIZER, useFactory: (configService: ConfigurationService) => () => { return configService.load() }, deps: [ConfigurationService], multi: true
    },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    AddcontactComponent,
    DeactivateaccountComponent,
    ProfileComponent
  ]
})
export class AppModule { }
