import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { RestService } from 'src/app/services/rest/rest.service';
import { AvailabilityDto } from '../../model/availability.dto';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { Logger, CommonUtils } from 'src/app/common/utils';
import { UsersDto } from 'src/app/model/users.dto';
// 018244492244
// +33695096903

@Component({
  selector: 'availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.css'],
  providers: [DatePipe]
})
export class AvailabilityComponent implements OnInit {

  @Input("isRowLayout")
  isRowLayout = true;
  @Input()
  refreshAvailabilityComponent = 0
  getUrl = CommonUtils.DATA_BASE_URL

  public avList;
  public SERVICE_MODE = 'MONGO';
  private loggedInUser: UsersDto;
  private selectedUserId = 3;

  constructor(private service: RestService<AvailabilityDto>, private router: Router, private datePipe: DatePipe) { }

  ngOnInit() {
    this.service.setNullLoggedInUser();

    this.fetchDataFromServer();
    if(this.loggedInUser)
    Logger.error("this.loggedInUser.id===this.selectedUserId=" + (this.loggedInUser.id === this.selectedUserId))

  }

  fetchDataFromServer() {

    this.loggedInUser = JSON.parse(localStorage.getItem("u"))
    this.service.readUserId.subscribe(userId => {
      this.selectedUserId = userId;
      this.service.setLoggedInUser()
    }
    
    ,
    error=>{
this.service.setNullLoggedInUser();

}
    
    )


    if (this.loggedInUser) {
      this.service.readServiceMode.subscribe(mode => {
        this.SERVICE_MODE = mode;
      })


      if (this.SERVICE_MODE === "JPA" && this.getUrl.indexOf("/jpaSearchAvl") === -1)
        this.getUrl = this.getUrl + "/jpaSearchAvl/";
      else if (this.SERVICE_MODE === "MONGO" && this.getUrl.indexOf("/mongoAvl") === -1)
        this.getUrl = this.getUrl + "/mongoAvl/"
      let newUrl = this.getUrl + "?isActive=1&userId=" + this.selectedUserId;
      this.service.get(newUrl)
        .subscribe(data => {
          if (this.SERVICE_MODE === "JPA")
            this.avList = <AvailabilityDto[]>(data.content);
          else if (this.SERVICE_MODE === "MONGO")
            this.avList = <AvailabilityDto[]>(data);
          if (this.avList)
            this.avList.sort((a: AvailabilityDto, b: AvailabilityDto) => { return (b.id - (a.id)) })
        },
          erro => {
            alert("Is REST API Server Running? Try " + this.getUrl)
          }
        )
    }
  }
  ngOnChanges() {
    console.log("ngOChanges()====INSIDE Availability component.ts..=>refreshAvailabilityComponent= " + this.refreshAvailabilityComponent)

    this.fetchDataFromServer();

  }
  public formatDate(dt: string): Date {
    let dtStr = dt.replace(' ', 'T');
    let dateVal = new Date(dtStr);

    return dateVal
  }

  delete(i: number) {
    let deleteUrl = CommonUtils.DATA_BASE_URL
    if (this.SERVICE_MODE === "JPA" && deleteUrl.indexOf("/gskAvail/") === -1)
      deleteUrl = deleteUrl + "/gskAvail/" + i;
    else if (this.SERVICE_MODE === "MONGO" && deleteUrl.indexOf("/mongoAvail") === -1)
      deleteUrl = deleteUrl + "/mongoAvail/" + i;
    let avl = this.avList.find(av => av.id === i);
    this.service.delete(deleteUrl).subscribe(response => {
      let arrayIndex = this.avList.indexOf(avl);
      this.avList.splice(arrayIndex, 1);
      Logger.error(".....................Fixing avail count after deletion " + JSON.stringify(avl))

      this.fixAvailCount(avl.usersDTO.id)

    })

  }

  edit(i: number) {
    let editUrl = CommonUtils.DATA_BASE_URL
    if (this.SERVICE_MODE === "JPA")
      editUrl + "/jpaAvail/" + i;
    else if (this.SERVICE_MODE === "MONGO")
      editUrl + "/mongoAvail/" + i;

    console.log(editUrl);

  }
  confirm(p: AvailabilityDto) {
    this.service.setIsReservationEditMode(true)
    this.service.setAvailablility(p)
    this.router.navigate(["rsv/show/"], {})
  }




  fixAvailCount(userId: number) {
    Logger.error(".....................Fixing avail count after deletion ")
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
            Logger.debug("FIXAVIL_COUNT******** user=" + JSON.stringify(u));;
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
