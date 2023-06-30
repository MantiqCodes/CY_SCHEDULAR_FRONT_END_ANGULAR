import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonUtils, Logger } from 'src/app/common/utils';
import { RestService } from 'src/app/services/rest/rest.service';
import { AvailabilityDto } from '../../model/availability.dto';
import { DatePipe } from '@angular/common';
import { ReservationDto } from '../../model/reservation.dto';

@Component({
  selector: 'create-reservation',
  templateUrl: './create-reservation.component.html',
  styleUrls: ['./create-reservation.component.css'],
  providers: [DatePipe]
})
export class CreateReservationComponent implements OnInit {

  constructor(private service: RestService<any>, private datePipe: DatePipe) { }
  private SERVICE_MODE = "MONGO";
  private saveReservUrl = CommonUtils.DATA_BASE_URL;
  private saveAvlUrl = CommonUtils.DATA_BASE_URL;
  private deleteAvailUrl = CommonUtils.DATA_BASE_URL;
  private LAST_RESERV_ID: number;
  private LAST_AVAIL_ID: number;
  static eDate: Date
  @Output()
  change = new EventEmitter();
  startAt: Date;

  titleValue: string;
  emailValue: string;
  dateValue: Date;
  editDateValue: string;
  fromHourValue: number;
  fromMinuteValue: number;
  fromSecondValue: number;
  toHourValue: number;
  toMinuteValue: number;
  toSecondValue: number;
  isEditMode = false
  availabilityDto = new AvailabilityDto()

  getLastReservId(): number {

    let reservList: ReservationDto[]
    let getUrl = CommonUtils.DATA_BASE_URL;
    if (this.SERVICE_MODE === 'JPA' && getUrl.indexOf("/jpaReserv/") === -1)
      getUrl = getUrl + "/jpaReserv/";
    else if (this.SERVICE_MODE === 'MONGO' && getUrl.indexOf("/mongoReserv/") === -1)
      getUrl = getUrl + "/mongoReserv/";
    let lastId = -1;
    this.service.get(getUrl).subscribe(data => {
      reservList = <ReservationDto[]>data;
      reservList.sort((a: ReservationDto, b: ReservationDto) => { return (b.id - a.id) })
      this.LAST_RESERV_ID = reservList[0].id + 1;
      lastId = reservList[0].id + 1;
      // Logger.error("SEEEEEEEEEEEET_LAST_ID LAst reserv=" + JSON.stringify(reservList[0]))
      this.getLastAvailId();
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

  getLastAvailId(): number {

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
      this.createReservAndAvails()
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
  setUrl() {
    this.service.readServiceMode.subscribe(mode => {
      this.SERVICE_MODE = mode;

    })

    if (this.SERVICE_MODE === 'JPA' && this.saveReservUrl.indexOf("/jpaReserv/") === -1)
      this.saveReservUrl = this.saveReservUrl + "/jpaReserv/";
    else if (this.SERVICE_MODE === 'MONGO' && this.saveReservUrl.indexOf("/mongoReserv/") === -1)
      this.saveReservUrl = this.saveReservUrl + "/mongoReserv/";


    if (this.SERVICE_MODE === 'JPA' && this.saveAvlUrl.indexOf("/jpaAvail/") === -1)
      this.saveAvlUrl = this.saveAvlUrl + "/jpaAvail/";
    else if (this.SERVICE_MODE === 'MONGO' && this.saveAvlUrl.indexOf("/mongoAvail/") === -1)
      this.saveAvlUrl = this.saveAvlUrl + "/mongoAvail/";

    if (this.SERVICE_MODE === 'JPA' && this.deleteAvailUrl.indexOf("/jpaAvail/") === -1)

      this.deleteAvailUrl = this.deleteAvailUrl + "/jpaAvail/"

    else if (this.SERVICE_MODE === 'MONGO' && this.deleteAvailUrl.indexOf("/mongoAvail/") === -1)

      this.deleteAvailUrl = this.deleteAvailUrl + "/mongoAvail/"

  }

  ngOnInit() {
    let today = new Date();
    let month = today.getMonth() + 1; //fix 0 based month
    let year = today.getUTCFullYear();
    let day = today.getDay();
    this.startAt = new Date(year, month, day);
    this.fromHourValue = 0;
    this.fromMinuteValue = 0;
    this.fromSecondValue = 0;
    this.toHourValue = 0;
    this.toMinuteValue = 0;
    this.toSecondValue = 0;
    // if(this.isEditMode)
    this.readTransmittedData()
  }
  readTransmittedData() {
    //redirect
    this.service.readIsReservationEditMode.subscribe(s => {
      // Logger.error("CreateRsvComp.ts==>=ngOnInit()==>isEditMode=" + s)
      if (s === true) {
        this.service.readAvailability.subscribe(p => {
          this.isEditMode = s;
          this.availabilityDto = p;
          Logger.debug("TRANMITTREAD_FROM_SERVICE==dto=" + JSON.stringify(p))
          Logger.error("p.starTime=" + p.startTime)
          if (p && p.startTime) {



            // populate form fields 
            this.editDateValue = this.datePipe.transform(p.startTime, "yyyy-MM-dd")
            this.dateValue = new Date(p.startTime.toString().replace(' ', 'T'))

            let fromDateParts = this.getDateParts(p.startTime.toString());
            this.fromHourValue = fromDateParts.H;
            this.fromMinuteValue = fromDateParts.m
            this.fromSecondValue = fromDateParts.s
            let toDateParts = this.getDateParts(p.endTime.toString());
            this.toHourValue = toDateParts.H
            this.toMinuteValue = toDateParts.m
            this.toSecondValue = toDateParts.s
          }

        })
      }
    })
  }
  getDateStrOnly(dt: Date): string {
    return dt.getUTCFullYear() + "-" + dt.getUTCMonth() + "-" + dt.getUTCDate();
  }
  timePickerFormGroup = new FormGroup({
    fromHour: new FormControl(),
    fromMinute: new FormControl(),
    fromSecond: new FormControl(),
    toHour: new FormControl(),
    toMinute: new FormControl(),
    toSecond: new FormControl(),
    pickedDate: new FormControl(),
    isActive: new FormControl(),
    userId: new FormControl(),
    email: new FormControl(),
    title: new FormControl(),
    editDate: new FormControl()
  });

  get fromHour() { return this.timePickerFormGroup.get("fromHour").value }
  get fromMinute() { return this.timePickerFormGroup.get("fromMinute").value }
  get fromSecond() { return this.timePickerFormGroup.get("fromSecond").value }
  get toHour() { return this.timePickerFormGroup.get("toHour").value }
  get toMinute() { return this.timePickerFormGroup.get("toMinute").value }
  get toSecond() { return this.timePickerFormGroup.get("toSecond").value }
  get pickedDate() { return this.timePickerFormGroup.get("pickedDate").value }
  get isActive() { return this.timePickerFormGroup.get("isActive").value }
  get email() { return this.timePickerFormGroup.get("email").value }
  get title() { return this.timePickerFormGroup.get("title").value }



  saveAvl() {

    this.setUrl();
    this.getLastReservId();

  }


  createReservAndAvails() {
    // Logger.error("&&&&&&&&&&&&&&&&&&&&&&&&Start of saveRSV****************")
    let activeDate: Date;
    if (this.isEditMode)
      activeDate = new Date(this.editDateValue.toString());
    else
      activeDate = this.pickedDate;

    let rsv = new ReservationTimeSlot();
    rsv.title = this.title;
    rsv.email = this.email;
    if (!this.isEditMode) {
      rsv.fromTime = CommonUtils.getDateStr(activeDate, this.fromHour, this.fromMinute, this.fromSecond)
      rsv.toTime = CommonUtils.getDateStr(activeDate, this.toHour, this.toMinute, this.toSecond);
    }
    else {
      let dp = this.getDateParts(this.availabilityDto.startTime.toString())
      dp.H = this.fromHour
      dp.m = this.fromMinute
      dp.s = this.fromSecond

      rsv.fromTime = this.getStrDateFromDateParts(dp)
      dp.H = this.toHour
      dp.m = this.toMinute
      dp.s = this.toSecond

      rsv.toTime = this.getStrDateFromDateParts(dp)
    }


    // avl.isActive = (this.isActive === true ? 1 : 0)
    rsv.isActive = this.isActive === false ? 0 : 1

    // this.service.readUserId.subscribe(uId => {
    //   rsv.userId = uId;
    // })
    let u=JSON.parse(localStorage.getItem("u"))
    if(u)
    rsv.userId=u.id;

    let rsvJSON = {
      "title": rsv.title,
      "email": rsv.email,
      "startTime": rsv.fromTime,
      "endTime": rsv.toTime,
      "isActive": rsv.isActive,
      "gskUsersDTO": {
        "id": rsv.userId
      }
    }

    if (rsv.fromTime && rsv.toTime && rsv.userId & rsv.isActive && rsv.email && rsv.title
      && !rsv.fromTime.includes('NaN') && !rsv.toTime.includes('NaN')
    ) {


      if (rsvJSON.startTime && rsvJSON.endTime && rsvJSON.gskUsersDTO.id)
        if (this.isEditMode) {



          let dtoFromTime = this.getDateFromDateParts(this.getDateParts(this.availabilityDto.startTime.toString()))
          let dtoToTime = this.getDateFromDateParts(this.getDateParts(this.availabilityDto.endTime.toString()))
          let dtoStrFromTime = this.getStrDateFromDateParts(this.getDateParts(this.availabilityDto.startTime.toString()))
          let dtoStrToTime = this.getStrDateFromDateParts(this.getDateParts(this.availabilityDto.endTime.toString()))

          let rsvFromTime = this.getDateFromDateParts(this.getDateParts(rsv.fromTime))
          let rsvToTime = this.getDateFromDateParts(this.getDateParts(rsv.toTime))
          let rsvStrFromTime = this.getStrDateFromDateParts(this.getDateParts(rsv.fromTime))
          let rsvStrToTime = this.getStrDateFromDateParts(this.getDateParts(rsv.toTime))

          // 1.check if the current selected time is different from the edited time

          // =================|============|
          if (rsvFromTime.getTime() > dtoFromTime.getTime() &&
            rsvToTime.getTime() === dtoToTime.getTime()) {

            // create availablility 

            let avlJSON1 = {
              "startTime": dtoStrFromTime,
              "endTime": rsvStrFromTime,
              "isActive": rsv.isActive,
              "gskUsersDTO": {
                "id": rsv.userId
              }
            }
            let avlJSON1Mongo = {
              "id": this.LAST_AVAIL_ID,
              "startTime": dtoStrFromTime,
              "endTime": rsvStrFromTime,
              "isActive": rsv.isActive,
              "usersDTO": {
                "id": rsv.userId
              }
            }



            // create availability saving url 
            if (this.SERVICE_MODE === 'JPA') {
              this.service.save(this.saveAvlUrl, avlJSON1).subscribe(newAv => {
                Logger.debug("=================|============|created availability=+++++++++++++++=" + JSON.stringify(newAv));
              })
            }
            if (this.SERVICE_MODE === 'MONGO') {
              this.service.save(this.saveAvlUrl, avlJSON1Mongo).subscribe(newAv => {
                Logger.debug("=================|============|created availability=+++++++++++++++=" + JSON.stringify(newAv));
                this.LAST_AVAIL_ID = this.LAST_AVAIL_ID + 1;
                this.incrementAvailabilityCountInUser(rsv.userId)

              })
            }
          }

          //|=========|====================

          else if (rsvFromTime.getTime() === dtoFromTime.getTime() &&
            rsvToTime.getTime() < dtoToTime.getTime()) {
            // create availablility 

            let avlJSON1 = {
              "startTime": rsvStrToTime,
              "endTime": dtoStrToTime,
              "isActive": rsv.isActive,
              "gskUsersDTO": {
                "id": rsv.userId
              }
            }
            let avlJSON1Mongo = {
              "id": this.LAST_AVAIL_ID,
              "startTime": rsvStrToTime,
              "endTime": dtoStrToTime,
              "isActive": rsv.isActive,
              "usersDTO": {
                "id": rsv.userId
              }
            }


            // create availability saving url 

            if (this.SERVICE_MODE === 'JPA')
              this.service.save(this.saveAvlUrl, avlJSON1).subscribe(newAv => {
                Logger.debug("|=========|====================created availability=+++++++++++++++=" + JSON.stringify(newAv));
              })
            else if (this.SERVICE_MODE === 'MONGO')
              this.service.save(this.saveAvlUrl, avlJSON1Mongo).subscribe(newAv => {
                Logger.debug("|=========|====================created availability=+++++++++++++++=" + JSON.stringify(newAv));
                this.incrementAvailabilityCountInUser(rsv.userId)
                this.LAST_AVAIL_ID = this.LAST_AVAIL_ID + 1;

              })



          }

          // //==============|********|=======

          else if (rsvFromTime.getTime() > dtoFromTime.getTime() &&
            rsvToTime.getTime() < dtoToTime.getTime()) {
            // create 1st availablility 

            let avlJSON1 = {
              "startTime": dtoStrFromTime,
              "endTime": rsvStrFromTime,
              "isActive": rsv.isActive,
              "gskUsersDTO": {
                "id": rsv.userId
              }
            }
            let avlJSON1Mongo = {
              "id": this.LAST_AVAIL_ID,
              "startTime": dtoStrFromTime,
              "endTime": rsvStrFromTime,
              "isActive": rsv.isActive,
              "usersDTO": {
                "id": rsv.userId
              }
            }


            // create availability saving url 



            if (this.SERVICE_MODE === 'JPA')
              this.service.save(this.saveAvlUrl, avlJSON1).subscribe(newAv => {
                Logger.debug("=+=+=+=+=|********|=======created availability=+++++++++++++++=" + JSON.stringify(newAv));
              })
            else if (this.SERVICE_MODE === 'MONG')
              this.service.save(this.saveAvlUrl, avlJSON1Mongo).subscribe(newAv => {
                Logger.debug("=+=+=+=+=|********|=======created availability=+++++++++++++++=" + JSON.stringify(newAv));
                this.LAST_AVAIL_ID = this.LAST_AVAIL_ID + 1;

                this.incrementAvailabilityCountInUser(rsv.userId)

              })


            avlJSON1 = {
              "startTime": rsvStrToTime,
              "endTime": dtoStrToTime,
              "isActive": rsv.isActive,
              "gskUsersDTO": {
                "id": rsv.userId
              }
            }

            avlJSON1Mongo = {
              "id": this.LAST_AVAIL_ID,
              "startTime": rsvStrToTime,
              "endTime": dtoStrToTime,
              "isActive": rsv.isActive,
              "usersDTO": {
                "id": rsv.userId
              }
            }

            // create availability saving url 
            if (this.SERVICE_MODE === 'JPA')
              this.service.save(this.saveAvlUrl, avlJSON1).subscribe(newAv => {
                Logger.debug("==============|********|=+=+=+=+=created availability=+++++++++++++++=" + JSON.stringify(newAv));
              })
            if (this.SERVICE_MODE === 'MONGO')
              this.service.save(this.saveAvlUrl, avlJSON1Mongo).subscribe(newAv => {
                Logger.debug("==============|********|=+=+=+=+=created availability=+++++++++++++++=" + JSON.stringify(newAv));
                this.LAST_AVAIL_ID = this.LAST_AVAIL_ID + 1;

                this.incrementAvailabilityCountInUser(rsv.userId)

              })


          }

          // 2.create differetn RSV  
        }
      // 3. creating RSV
      if (this.SERVICE_MODE === 'JPA') {
        this.service.save(this.saveReservUrl, rsvJSON).subscribe(resp => {
          Logger.debug("============created RSV=+++++++++++++++=" + JSON.stringify(resp));
          Logger.error("$$$$$$$$$$$$$$$$ avl dt => id=" + this.availabilityDto.id)

          this.postCreateReservation(rsv, this.availabilityDto);
        })
      } else if (this.SERVICE_MODE === 'MONGO') {
        let rsvJSONMongo = {
          "id": this.LAST_RESERV_ID,
          "title": rsv.title,
          "email": rsv.email,
          "startTime": rsv.fromTime,
          "endTime": rsv.toTime,
          "isActive": rsv.isActive,
          "usersDTO": {
            "id": rsv.userId
          }
        }

        Logger.error(this.LAST_RESERV_ID + "=LAST_RESERV_ID*********************pre-flight*****Save RSV=" + JSON.stringify(rsvJSONMongo))

        this.service.save(this.saveReservUrl, rsvJSONMongo).subscribe(resp => {
          Logger.debug("============created RSV=+++++++++++++++=" + JSON.stringify(resp));
          this.service.readUserId.subscribe(uId => {
            this.incrementReservationCountInUser(uId);
          })

          this.postCreateReservation(rsv, this.availabilityDto);
        })
      }
    }
    // Reset form fields 

    this.titleValue = null;
    this.emailValue = null;
    this.editDateValue = null
    this.dateValue = null

    this.fromHourValue = 0
    this.fromMinuteValue = 0
    this.fromSecondValue = 0

    this.toHourValue = 0
    this.toMinuteValue = 0
    this.toSecondValue = 0
    this.isEditMode = false;
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

  incrementReservationCountInUser(userId: number) {

    // find user by id 
    // increment availability in user 
    this.service.get(CommonUtils.DATA_BASE_URL + "/mongoUsers/" + userId).subscribe(u => {
      Logger.debug("Found******** user=" + JSON.stringify(u));;
      u.reservCount = u.reservCount + 1;
      this.service.update(CommonUtils.DATA_BASE_URL + "/mongoUsers/", u).subscribe(resp => {
        Logger.debug("******** updated user =" + JSON.stringify(resp))
      })
    })

  }
  postCreateReservation(rsv, avlDTO) {
    Logger.error("$$$$$$$$$$$$$$$$ avl dt => id=" + this.availabilityDto.id)

    //  delete availablility 
    if(this.isEditMode)
    {
    this.service.delete(this.deleteAvailUrl + avlDTO.id).subscribe(d => {
      Logger.debug("Deleted Availability=" + JSON.stringify(avlDTO))
      this.fixAvailCount(rsv.userId)
    })
  }
    this.change.emit(rsv);
    console.log("===createResvervation====saveAvl()====EMITTED=>" + JSON.stringify(rsv))
    // cleare service Observable
    if (this.isEditMode) {
      this.service.setIsReservationEditMode(false)
      this.service.setAvailablility(null)
      this.isEditMode=false
    }

  }
  ngOnDestroy() {

    Logger.error("+++createReservation.TS++++++OnDestry++++++++++++++LAST_LINE_OF_ngOnDestroy()+++++++++++++++++++++++")

  }

  getDateFromString(dateStr: string): Date {

    let dateAndTimeArray = dateStr.split(' ');
    let dateArray = dateAndTimeArray[0].split('-');
    let timeArray = dateAndTimeArray[1].split(':')

    let originalStartDate = new Date(
      +dateArray[0],
      +dateArray[1],
      +dateArray[2],
      +timeArray[0],
      +timeArray[1],
      +timeArray[2]
    )
    return originalStartDate;
  }
  getDateFromDateParts(dp: DateParts): Date {
    // Logger.debug("DateFromDateParts---recived="+dp.y+"-"+dp.M+"-"+dp.d+" "+dp.H+":"+dp.m+":"+dp.s)
    // Month is 0-11 based index , day of week is also 0-6 
    return new Date(dp.y, dp.M - 1, dp.d, dp.H, dp.m, dp.s)
  }
  getStrDateFromDateParts(dp: DateParts): string {
    return dp.y + "-" + dp.M + "-" + dp.d + " " + dp.H + ":" + dp.m + ":" + dp.s
  }
  getDateParts(dateStr: string): DateParts {

    let dateAndTimeArray = dateStr.split(' ');
    let dateArray = dateAndTimeArray[0].split('-');
    let timeArray = dateAndTimeArray[1].split(':')

    let datePart = new DateParts();
    datePart.y = +dateArray[0];
    datePart.M = +dateArray[1]
    datePart.d = +dateArray[2]
    datePart.H = +timeArray[0]
    datePart.m = +timeArray[1]
    datePart.s = +timeArray[2]

    return datePart;
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
}

export class ReservationTimeSlot {
  title: string;
  email: string;
  fromTime: string;
  toTime: string;
  userId: number;
  isActive: number;
}

export class DateParts {
  y: number
  M: number
  d: number
  H: number
  m: number
  s: number
}