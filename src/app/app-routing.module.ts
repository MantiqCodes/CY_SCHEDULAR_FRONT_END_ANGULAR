import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { AvailabilityComponent } from './components/availability/availability.component';
import { CreateAvailabilityComponent } from './components/create-availability/create-availability.component';
import { CreateReservationComponent } from './components/create-reservation/create-reservation.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { LoginComponent } from './components/login/login.component';
import { ReservationComponent } from './components/reservation/reservation.component';
import { SearchAvailabilityComponent } from './components/search-availability/search-availability.component';
import { SearchReservationComponent } from './components/search-reservation/search-reservation.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ShowAvailabilityComponent } from './components/show-availability/show-availability.component';
import { ShowReservationComponent } from './components/show-reservation/show-reservation.component';
import { UsersComponent } from './components/users/users.component';
import { AuthGuard } from './services/auth-guard/auth.guard';

const routes: Routes = [

  
  { path: "", redirectTo:"avl",pathMatch:'full' },
  { path: "avl/new", component: CreateAvailabilityComponent ,canActivate:[AuthGuard]},
  { path: "avl/show", component: ShowAvailabilityComponent  ,canActivate:[AuthGuard]},
  { path: "rsv/new", component: CreateReservationComponent ,canActivate:[AuthGuard]},
  { path: "rsv/show", component: ShowReservationComponent ,canActivate:[AuthGuard]},
  { path: "avl", component: AvailabilityComponent  ,canActivate:[AuthGuard]},
  { path: "rsv", component: ReservationComponent ,canActivate:[AuthGuard]},
  
  { path: "user", component: UsersComponent ,canActivate:[AuthGuard]},
  { path: "settings", component: SettingsComponent  ,canActivate:[AuthGuard]},
  
  {path:"login",component:LoginComponent},
  { path: "user/new", component: CreateUserComponent },
  {path:"**",component:LoginComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
exports: [RouterModule]
})
export class AppRoutingModule { }
