import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanDeactivate, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Logger } from 'src/app/common/utils';
import { AuthService } from '../auth/auth.service';
import { AppComponent } from '../../app.component';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate //, CanActivateChild, CanDeactivate<unknown>, CanLoad 
{
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let url: string = state.url;
    Logger.debug(this.authService.isLoggedIn() + "=this.authService.isLoggedIn()~*~*~*~*~*~*~*~~* aAuth Guard .url=" + url)

    if (this.authService.isLoggedIn()) {


      return true;
    }

    // if(state.url==='/user')
    this.router.navigate(['login/'])
    // else
    // this.router.navigate(["user/new"]);
    this.authService.correctLogout()
    return false;
  }
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(next, state);
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }
  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }

  // checkUserLogin(route: ActivatedRouteSnapshot, url: any): boolean {
  //   Logger.debug("~*~*~*~*~*~*~*~~* aAuth Guard ... ")

  //   if (this.authService.isLoggedIn()) {

  //     this.router.navigate(["avl"]);

  //     return true;
  //   }

  //   this.router.navigate(["user/new"]);
  //   return false;
  // }
}
