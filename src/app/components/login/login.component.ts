import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/services/rest/rest.service';
import { Router } from '@angular/router';
import { CommonUtils, Logger } from 'src/app/common/utils';
import { UsersDto } from '../../model/users.dto';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { NavigatorComponent } from '../navigator/navigator.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private SERVICE_MODE = "MONGO";
  private showPassword = false;
  constructor(
    private service: RestService<UsersDto>,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {

    
this.service.setNullLoggedInUser();
  
    
    this.service.readServiceMode.subscribe(mode => { this.SERVICE_MODE = mode })
  }
  userFormGroup = new FormGroup({
    email: new FormControl(),
    password: new FormControl()

  });
  get email() { return this.userFormGroup.get('email').value }
  get password() { return this.userFormGroup.get('password').value }

  login() {

    // let isLoggedIn = this.authService.login(this.email, this.password)
    // if (isLoggedIn) {
    //   Logger.error("_____________________Logged in , redirect ...")
    //   let u = this.authService.getLoggedInUser();
    //   if (u.role === "regular")
    //     this.router.navigate(["user/"], {})
    // }
    this.loginByAuth(this.email, this.password);



  }


  private loginUrl = CommonUtils.DATA_BASE_URL;

  setUrl() {
    this.service.readServiceMode.subscribe(mode => {

      this.SERVICE_MODE = mode;
    })
    if (this.SERVICE_MODE === "MONGO" && this.loginUrl.indexOf("/mongoLogin/") === -1)
      this.loginUrl = this.loginUrl + "/mongoLogin/?";

  }

  loginByAuth(email: string, password: string): boolean {
    this.loginUrl = CommonUtils.DATA_BASE_URL;
    this.setUrl();
    let val = false;
    if (this.loginUrl.indexOf("email") === -1)
      this.loginUrl = this.loginUrl + "email=" + email;
    if (this.loginUrl.indexOf("password") === -1)
      this.loginUrl = this.loginUrl + "&password=" + password;
    this.service.get(this.loginUrl).subscribe(u => {
      localStorage.setItem("u", JSON.stringify(u));
      localStorage.setItem("isLoggedIn", "true");
      Logger.debug("-------------- login Succeeded u =" + JSON.stringify(u))
      val = true;
      this.service.setUserId(u.id)
      this.service.setLoggedInUser();
      this.router.navigate(["/user"], {})

    },

      error => {
        localStorage.removeItem("u");
        localStorage.setItem("isLoggedIn", "false")
        Logger.debug("00000000000000000 login failed ")
        val = false;
      })
    return val;
  }
}
