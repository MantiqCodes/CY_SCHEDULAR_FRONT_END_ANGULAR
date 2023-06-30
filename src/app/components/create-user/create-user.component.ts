import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UsersDto } from '../../model/users.dto';
import { AppProperties } from '../../app.properties';
import { RestService } from 'src/app/services/rest/rest.service';
import { Router } from '@angular/router';
import { CommonUtils } from 'src/app/common/utils';

@Component({
  selector: 'create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
private SERVICE_MODE="MONGO";
private showPassword=false;
private user:UsersDto;
  constructor(
    private service: RestService<UsersDto>,
    private router: Router
  ) { }

  ngOnInit() {
    this.service.readServiceMode.subscribe(mode=>{this.SERVICE_MODE=mode})
    this.setLastUserId()
    this.user=JSON.parse(localStorage.getItem("u"))

  }

  isEditMode = false;

  userFormGroup = new FormGroup({
    userId: new FormControl(),
    firstName: new FormControl(),
    lastName: new FormControl(),
    email: new FormControl(),
    isActive: new FormControl(), 
    isAdmin:new FormControl(),
    phoneNumber: new FormControl()

  });


  get userId() { return this.userFormGroup.get('userId').value }
  get firstName() { return this.userFormGroup.get('firstName').value }
  get lastName() { return this.userFormGroup.get('lastName').value }
  get email() { return this.userFormGroup.get('email').value }
  get isActive() { return this.userFormGroup.get('isActive').value }
  get isAdmin() { return this.userFormGroup.get("isAdmin").value} 
  get phoneNumber() { return this.userFormGroup.get('phoneNumber').value }

  readFormData(): UsersDto {

    let u = new UsersDto();
    u.id = this.userId;
    u.firstName = this.firstName
    u.lastName = this.lastName
    u.email = this.email
    u.phoneNumber = this.phoneNumber
    u.isActive = this.isActive === false ? 0 : 1

    return u;
  }

private static USER_ID;
setLastUserId()
{
let userList:UsersDto[];
  let getUrl=CommonUtils.DATA_BASE_URL;
  this.service.readServiceMode.subscribe(mode=>{this.SERVICE_MODE=mode})
  if( this.SERVICE_MODE==="JPA")
  getUrl=getUrl+"/jpaUsers/"
  else if (this.SERVICE_MODE==="MONGO")
  getUrl=getUrl+"/mongoUsers/"
 this.service.get(getUrl)
  .subscribe(data=>{
    
                     userList= <UsersDto[]>(data);
                     userList.sort((a,b)=>{return (b.id-a.id)})
                     CreateUserComponent.USER_ID=(userList[0].id+1)
                  
                    },
            erro=>{
                  alert("Is REST API Server Running? Try "+getUrl)
                  }
  )

}
  saveUser() {

    let putUrl = CommonUtils.DATA_BASE_URL
    
    if( this.SERVICE_MODE==="JPA")
    putUrl=putUrl+ "/jpaUsers/";
    else if(this.SERVICE_MODE==="MONGO")
    putUrl=putUrl+"/mongoUsers/"

    let u = this.readFormData();
    u.id=CreateUserComponent.USER_ID;
    CreateUserComponent.USER_ID=CreateUserComponent.USER_ID+1;


    console.log("=createUsersComponent.ts=>=======users=>" + JSON.stringify(u))


    if (u.email && u.firstName && u.lastName) {
      this.service.save(putUrl, u).subscribe(response => {
        console.log(JSON.stringify(response));
      }
      );
       this.router.navigate(["user/"],{})
    }
  }
  showCheckBox($event) {
    console.log("=========showChekbox()")
    console.log(this.userFormGroup.get('isActive').value)
    $event.stopPropagation
  }

}
