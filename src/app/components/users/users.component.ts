import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AppProperties } from 'src/app/app.properties';
import { UsersDto } from 'src/app/model/users.dto';
import { RestService } from 'src/app/services/rest/rest.service';
import { CommonUtils } from 'src/app/common/utils';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
  
})
export class UsersComponent implements OnInit {
@Input("isRowLayout")
isRowLayout=true
private SERVICE_MODE;

  getUrl = CommonUtils.DATA_BASE_URL 

  public today=new Date('2016-01-01');
  public  userList:UsersDto[];

  constructor(private service:RestService<UsersDto>) { }

ngOnInit() {

  this.service.readServiceMode.subscribe(mode=>{this.SERVICE_MODE=mode})
  if( this.SERVICE_MODE==="JPA")
  this.getUrl=this.getUrl+"/jpaUsers/"
  else if (this.SERVICE_MODE==="MONGO")
  this.getUrl=this.getUrl+"/mongoUsers/"
 this.service.get(this.getUrl)
  .subscribe(data=>{
    
                     this.userList= <UsersDto[]>(data);
                     this.userList.sort((a,b)=>{return (b.id-a.id)})
                  },
            erro=>{
                  alert("Is REST API Server Running? Try "+this.getUrl)
                  }
  )
}

broadCastUserId(userId:number)
{

  this.service.setUserId(userId)
}

deleteUser(id)
{
 let  deleteUrl=CommonUtils.DATA_BASE_URL;
  if(this.SERVICE_MODE==="JPA")
  deleteUrl=deleteUrl+"/jpaUsers/"
  else if (this.SERVICE_MODE==="MONGO")
  deleteUrl=deleteUrl+"/mongoUsers/"
  deleteUrl=deleteUrl+"/"+id
  let deletedUser=this.userList.find(u=>u.id===id);
this.service.delete(deleteUrl).subscribe(resp=>{
let deleteIndex=this.userList.indexOf(deletedUser)
this.userList.splice(deleteIndex,1);
})
}
}
