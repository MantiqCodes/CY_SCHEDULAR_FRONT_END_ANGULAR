import { Component, Input, NgZone, OnInit } from '@angular/core';
import { UsersDto } from 'src/app/model/users.dto';
import { RestService } from 'src/app/services/rest/rest.service';
import { CommonUtils, Logger } from 'src/app/common/utils';
import { NavigationEnd, Router } from '@angular/router';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.css']
})
export class NavigatorComponent implements OnInit {

  @Input()
  public static changeCounter = -1
  private user: UsersDto
  private userId: number;
  private SERVICE_MODE = "MONGO"


  constructor(private service: RestService<UsersDto>, private router: Router) {

  }


  ngOnInit() {
    this.service.readLoggedInUser.subscribe(u => {
      this.user = JSON.parse(localStorage.getItem("u"));

    }
    ,
    error=>{
this.service.setNullLoggedInUser();
    });
    
  }

  logOut() {

    this.service.setNullLoggedInUser();
      localStorage.removeItem("u");
      localStorage.setItem("isLoggedIn", "fasle")
      Logger.error("loggedinuser removed")
      //  for ui update call navigate in a asyc task
      this.service.readUserId.subscribe(id=>{
        this.router.navigate(["/user"],{})

  }
   ,error=>{
    this.router.navigate(["/user"],{})

   }   
      )
      
//  at this moment , after logout > login > this method is  is colled . , refresh the page , it works 
//  there is a history of routes that is being called after the navigation.  
    }
  

}


