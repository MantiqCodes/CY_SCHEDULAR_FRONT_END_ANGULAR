import { Injectable } from '@angular/core';
import { RestService } from 'src/app/services/rest/rest.service';
import { CommonUtils, Logger } from 'src/app/common/utils';
import { UsersDto } from 'src/app/model/users.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginUrl=CommonUtils.DATA_BASE_URL;
  constructor(private service:RestService<any>) { }

  private SERVICE_MODE = "MONGO";
  setUrl() {
    this.service.readServiceMode.subscribe(mode => {

      this.SERVICE_MODE = mode;
    })
 if (this.SERVICE_MODE === "MONGO" && this.loginUrl.indexOf("/mongoLogin/") === -1)
      this.loginUrl = this.loginUrl + "/mongoLogin/?";

  }

login(email:string,password:string):boolean
{
  this.loginUrl=CommonUtils.DATA_BASE_URL;
  this.setUrl();
  let val=false;
  if(this.loginUrl.indexOf("email")===-1)
this.loginUrl=this.loginUrl+"email="+email;
if(this.loginUrl.indexOf("password")===-1)
this.loginUrl=this.loginUrl+"&password="+password;
this.service.get(this.loginUrl).subscribe(u=>{
  localStorage.setItem("u",JSON.stringify(u) );
  localStorage.setItem("isLoggedIn","true");
Logger.debug("-------------- login Succeeded u ="+JSON.stringify(u))
val= true;
},

error=>{
localStorage.removeItem("u");
localStorage.setItem("isLoggedIn","false")
Logger.debug("00000000000000000 login failed ")
val= false;
})
return val;
}


getLoggedInUser():UsersDto
{
return JSON.parse(localStorage.getItem("u"))
}


isLoggedIn():boolean
{
  let u :UsersDto;
  u=JSON.parse(localStorage.getItem("u"));
  if(u&&u.id)
  return true;
  return false; 
}
getRole():string
{
  let u :UsersDto;
  u=JSON.parse(localStorage.getItem("u"));
  if(u&&u.id)
  return u.role;
  
}
correctLogout()
{
  this.service.setNullLoggedInUser()
}
}
