import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonUtils, Logger } from 'src/app/common/utils';
import { RestService } from 'src/app/services/rest/rest.service';
import { AvailabilityDto } from '../../model/availability.dto';

@Component({
  selector: 'create-availability',
  templateUrl: './create-availability.component.html',
  styleUrls: ['./create-availability.component.css']
})
export class CreateAvailabilityComponent implements OnInit {

  @Output()
  change = new EventEmitter();
  startAt: Date;
  constructor(private service: RestService<any>) { }
  private SERVICE_MODE = 'MONGO'
  private LAST_AVAIL_ID: number
  ngOnInit() {
    let today = new Date();
    let month = today.getMonth() + 1; //next month
    let year = today.getUTCFullYear();
    let day = today.getDay();

    this.startAt = new Date(year, month, day);
    this.service.readServiceMode.subscribe(mode => { this.SERVICE_MODE = mode })
  }


  timePickerFormGroup = new FormGroup({
    pickedDate: new FormControl(),
    fromHour: new FormControl(),
    fromMinute: new FormControl(),
    fromSecond: new FormControl(),
    toHour: new FormControl(),
    toMinute: new FormControl(),
    toSecond: new FormControl(),
    isActive: new FormControl(),
    userId: new FormControl()
  });

  get fromHour() { return this.timePickerFormGroup.get("fromHour").value }
  get fromMinute() { return this.timePickerFormGroup.get("fromMinute").value }
  get fromSecond() { return this.timePickerFormGroup.get("fromSecond").value }
  get toHour() { return this.timePickerFormGroup.get("toHour").value }
  get toMinute() { return this.timePickerFormGroup.get("toMinute").value }
  get toSecond() { return this.timePickerFormGroup.get("toSecond").value }
  get pickedDate() { return this.timePickerFormGroup.get("pickedDate").value }
  get isActive() { return this.timePickerFormGroup.get("isActive").value }


  saveAvl() {
    this.setLastAvailId()
  }
  createAvail() {
    let newAvlDate = this.pickedDate

    let avl = new AvailableTimeSlot();
    avl.fromTime = CommonUtils.getDateStr(this.pickedDate, this.fromHour, this.fromMinute, this.fromSecond)
    avl.toTime = CommonUtils.getDateStr(this.pickedDate, this.toHour, this.toMinute, this.toSecond);
    // avl.isActive = this.isActive === true ? 1 : 0
    avl.isActive = this.isActive === false ? 0 : 1

    this.service.readUserId.subscribe(uId => {
      avl.userId = uId;
    })


    let data = {

      "startTime": avl.fromTime,
      "endTime": avl.toTime,
      "isActive": avl.isActive,
      "gskUsersDTO": {
        "id": avl.userId
      }
    }
    let dataMongo = {
      "id": this.LAST_AVAIL_ID,
      "startTime": avl.fromTime,
      "endTime": avl.toTime,
      "isActive": avl.isActive,
      "usersDTO": {
        "id": avl.userId
      }
    }
    let avlSaveUrl = CommonUtils.DATA_BASE_URL
    if (this.SERVICE_MODE === 'JPA')
      avlSaveUrl = avlSaveUrl + "/jpaAvail/";
    else if (this.SERVICE_MODE === 'MONGO')
      avlSaveUrl = avlSaveUrl + "/mongoAvail/"

    console.log("FFFFFFFFFFFF data =" + JSON.stringify(dataMongo))
    // if (avl.fromTime && avl.toTime && avl.userId & avl.isActive) {
    if (this.SERVICE_MODE === 'JPA') {
      if (data.startTime && data.endTime && data.gskUsersDTO.id)
        this.service.save(avlSaveUrl, data).subscribe(resp => {
          console.log("===createAvlComp.ts=> saveAvl().subscribe()=>==saved data from server ====" + resp)
        })
    }
    else
    if (this.SERVICE_MODE === 'MONGO') {
      if (dataMongo.startTime && dataMongo.endTime && dataMongo.usersDTO.id)
        this.service.save(avlSaveUrl, dataMongo).subscribe(resp => {
          console.log("===createAvlComp.ts=> saveAvl().subscribe()=>==saved data from server ====" + JSON.stringify(resp))
          this.fixAvailCount(dataMongo.usersDTO.id)
        })
    }

    this.change.emit(avl);

    console.log("===createAvl====saveAvl()====EMITTing=>" + JSON.stringify(avl))

    // }

  }
  showCheckBox($event) {
    console.log("=========showChekbox()")
    console.log(this.timePickerFormGroup.get('isActive').value)
    $event.stopPropagation
  }
  incrementAvailabilityCountInUser(userId: number) {

    // find user by id 
    // increment availability in user 
    this.service.get(CommonUtils.DATA_BASE_URL + "/mongoUsers/" + userId).subscribe(u => {
      Logger.debug("Find******** user=" + JSON.stringify(u));;
      u.availCount = u.availCount + 1;
      this.service.update(CommonUtils.DATA_BASE_URL + "/mongoUsers/", u).subscribe(resp => {
        Logger.debug("******** updated user =" + JSON.stringify(resp))
      })
    })

  }

  fixAvailCount(userId: number) {
    let avList: AvailabilityDto[];
    let availGetUrl = CommonUtils.DATA_BASE_URL;
    if (this.SERVICE_MODE === "JPA" && availGetUrl.indexOf("/jpaSearchAvl") === -1)
      availGetUrl = availGetUrl + "/jpaSearchAvl/";
    else if (this.SERVICE_MODE === "MONGO" && availGetUrl.indexOf("/mongoAvl") === -1)
      availGetUrl = availGetUrl + "/mongoAvl/"
    let newUrl = availGetUrl + "?isActive=1&userId=" + userId;
    this.service.get(newUrl)
      .subscribe(data => {
        if (this.SERVICE_MODE === "JPA")
          avList = <AvailabilityDto[]>(data.content);
        else if (this.SERVICE_MODE === "MONGO")
          avList = <AvailabilityDto[]>(data);
        if (avList) {
          //  issue server request to fix the availablity count in user
          this.service.get(CommonUtils.DATA_BASE_URL + "/mongoUsers/" + userId).subscribe(u => {
            Logger.debug("Find******** user=" + JSON.stringify(u));;
            u.availCount = avList.length;
            this.service.update(CommonUtils.DATA_BASE_URL + "/mongoUsers/", u).subscribe(resp => {
              Logger.debug("******** updated user =" + JSON.stringify(resp))
            })
          })

        }

      }
      )
  }

  setLastAvailId(): number {

    let availList: AvailabilityDto[]
    let getUrl = CommonUtils.DATA_BASE_URL;
    if (this.SERVICE_MODE === 'JPA' && getUrl.indexOf("/jpaAvail/") === -1)
      getUrl = getUrl + "/jpaAvail/";
    else if (this.SERVICE_MODE === 'MONGO' && getUrl.indexOf("/mongoAvail/") === -1)
      getUrl = getUrl + "/mongoAvail/";
    let lastId = -1;
    this.service.get(getUrl).subscribe(data => {
      availList = <AvailabilityDto[]>data;
      availList.sort((a: AvailabilityDto, b: AvailabilityDto) => { return (b.id - a.id) })
      this.LAST_AVAIL_ID = availList[0].id + 1;
      lastId = availList[0].id + 1;
      // Logger.error("SEEEEEEEEEEEET_LAST_ID LAst reserv=" + JSON.stringify(reservList[0]))
      this.createAvail()
    })
      ,
      error => {
        if (this.SERVICE_MODE === 'MONGO')
          alert(" Is MongoDB and the backend  server  up? " + getUrl)
        else
          alert(" Is the backend  server  up? " + getUrl)

      }
    return lastId;
  }
}

export class AvailableTimeSlot {
  fromTime: string;
  toTime: string;
  userId: number;
  isActive: number;
}
