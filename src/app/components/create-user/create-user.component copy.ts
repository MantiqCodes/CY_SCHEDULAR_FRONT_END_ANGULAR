import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UsersDto } from '../../model/users.dto';
import { AppProperties } from '../../app.properties';
import { RestService } from 'src/app/services/rest/rest.service';
import { Router } from '@angular/router';

@Component({
  selector: 'create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

  constructor(
    private service: RestService<UsersDto>,
    private router: Router
  ) { }

  ngOnInit() {
  }

  isEditMode = true;
  enterIdManually=false
  BASE_URL = "http://" + AppProperties.DATA_SERVER_IP + ":" + AppProperties.DATA_SERVER_PORT;

  userFormGroup = new FormGroup({
    userId: new FormControl(),
    firstName: new FormControl(),
    lastName: new FormControl(),
    email: new FormControl(),
    isActive: new FormControl(),
    phoneNumber: new FormControl()
    

  });


  get userId() { return this.userFormGroup.get('userId').value }
  get firstName() { return this.userFormGroup.get('firstName').value }
  get lastName() { return this.userFormGroup.get('lastName').value }
  get email() { return this.userFormGroup.get('email').value }
  get isActive() { return this.userFormGroup.get('isActive').value }
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


  saveUser() {

    let putUrl = this.BASE_URL + "/gskUsers/";
    let u = this.readFormData();

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
  isEnabledIdInput($event)
  {
    this.enterIdManually=!this.enterIdManually;
    // $event.stopPropagation;
  }
}
