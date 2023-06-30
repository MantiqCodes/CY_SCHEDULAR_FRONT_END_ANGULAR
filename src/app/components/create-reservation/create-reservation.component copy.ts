
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AvailabilityDto } from '../../model/availability.dto';
import { RestService } from 'src/app/services/rest/rest.service';
import { AppProperties } from '../../app.properties';
import { Router } from '@angular/router';
import { CommonUtils } from '../../common/utils';

@Component({
  selector: 'create-reservation',
  templateUrl: './create-reservation.component.html',
  styleUrls: ['./create-reservation.component.css']
})
export class CreateReservationComponent implements OnInit {

  constructor(
    private service: RestService<any>,
    private router: Router,
  ) { }

  selctedUserId: number;
  selectedDate: Date;
  DATA_BASE_URL = "http://" + AppProperties.DATA_SERVER_IP + ":" + AppProperties.DATA_SERVER_PORT;



  ngOnInit() {
    this.service.readUserId.subscribe(userId => {
      this.selctedUserId = userId;

    });
  }

  avlFormGroup = new FormGroup(
    {
      avlDate: new FormControl(),
      startTime: new FormControl(),
      endTime: new FormControl(),
      isActive: new FormControl()

    }
  );
  get avlDate() { return this.avlFormGroup.get('avlDate').value };
  get startTime() { return this.avlFormGroup.get('startTime').value };
  get endTime() { return this.avlFormGroup.get('endTime').value };
  get isActive() { return this.avlFormGroup.get('isActive').value };



  readFormData(): AvailabilityDto {
    let avl = new AvailabilityDto();
    avl.startTime = this.startTime;
    avl.endTime = this.endTime;
    avl.isActive = this.isActive;
    avl.gskUsersDTO.id = this.selctedUserId;
    this.selectedDate=this.avlDate;

    return avl;
  }


  saveAvl() {

    let newDate=new Date();
  
  console.log(CommonUtils.getFormattedDateStr(newDate))
    //   this.service.save(this.DATA_BASE_URL + "/gskAvail/", this.readFormData()).subscribe(response => {

  //   });
  //   this.router.navigate(["avl/"], {});


  }


}
