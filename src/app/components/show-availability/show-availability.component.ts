import { Component, OnInit } from '@angular/core';
import { AvailableTimeSlot } from '../create-availability/create-availability.component';
import { RestService } from 'src/app/services/rest/rest.service';
import { AvailabilityDto } from 'src/app/model/availability.dto';
import { CommonUtils } from 'src/app/common/utils';
import { AvailabilityComponent } from '../availability/availability.component';
import { Router } from '@angular/router';

@Component({
  selector: 'show-availability',
  templateUrl: './show-availability.component.html',
  styleUrls: ['./show-availability.component.css']
})
export class ShowAvailabilityComponent implements OnInit {

  refreshAvailabilityComponent=0
  constructor(private service:RestService<any> , private router:Router) { }

  ngOnInit() {
  }
   counter=1
  saveNewAvl($event:AvailableTimeSlot)
  {

    console.log("***ShowAvailabilityComponent---receive trasmit==> saveNewAvl()=>"+$event)
    if($event.fromTime&&$event.toTime&&$event.userId)
    {
    }
    else
    // this.router.navigate(["/avl/show"],{})
    this.counter+=1;
    this.refreshAvailabilityComponent=this.counter
    console.log(this.counter+"=counter,  REDIRECT=====>>> next line $$$---shwoAvlComponent------> received empty TimeSlotEmittedData->"+JSON.stringify($event))

  }




}
