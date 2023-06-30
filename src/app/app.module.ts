import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import{BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatDialogModule, MatIconModule, MatInputModule, MatNativeDateModule} from '@angular/material';
import {MatDatepickerModule} from '@angular/material';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RestService } from './services/rest/rest.service';
import { UsersComponent } from './components/users/users.component';
import { AvailabilityComponent } from './components/availability/availability.component';
import {  EmailDialogComponent, ReservationComponent } from './components/reservation/reservation.component';
import { HttpClientModule } from '@angular/common/http';
import { NavigatorComponent } from './components/navigator/navigator.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { CreateAvailabilityComponent } from './components/create-availability/create-availability.component';
import { CreateReservationComponent } from './components/create-reservation/create-reservation.component';
import { ShowAvailabilityComponent } from './components/show-availability/show-availability.component';
import { ShowUsersComponent } from './components/show-users/show-users.component';
import { ShowReservationComponent } from './components/show-reservation/show-reservation.component';
import { SearchAvailabilityComponent } from './components/search-availability/search-availability.component';
import { SearchReservationComponent } from './components/search-reservation/search-reservation.component';
import { LoginComponent } from './components/login/login.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AuthService } from './services/auth/auth.service';
import { AuthGuard } from './services/auth-guard/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    AvailabilityComponent,
    ReservationComponent,
    NavigatorComponent,
    CreateUserComponent,
    CreateAvailabilityComponent,
    CreateReservationComponent,
    ShowAvailabilityComponent,
    ShowUsersComponent,
    ShowReservationComponent,
    EmailDialogComponent,
    SearchAvailabilityComponent,
    SearchReservationComponent,
    LoginComponent,
    SettingsComponent,
  ],
  imports: [
  BrowserModule,
  HttpClientModule,
  ReactiveFormsModule,
  FormsModule,
  AppRoutingModule,
  BrowserAnimationsModule,
  MatInputModule,
  MatDatepickerModule,
  MatIconModule,
  MatNativeDateModule,
  MatDialogModule

],
  providers: [RestService,AuthService,AuthGuard],
  bootstrap: [AppComponent],
  
entryComponents: [
   EmailDialogComponent
]
  
})
export class AppModule {


    

}
