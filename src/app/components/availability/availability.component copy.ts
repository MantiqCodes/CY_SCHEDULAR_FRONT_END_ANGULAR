import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { RestService } from 'src/app/services/rest/rest.service';
import { AvailabilityDto } from '../../model/availability.dto';
import { AppProperties } from '../../app.properties';
import { DatePipe } from '@angular/common';
import { CloseScrollStrategy } from '@angular/cdk/overlay';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { Logger, CommonUtils } from 'src/app/common/utils';
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
  getUrl = CommonUtils.DATA_BASE_URL+
    //  "/searchAvl/?startTime=2016-01-01";
    "/searchAvl/?isActive=1";

  public avList: AvailabilityDto[];
  public today = new Date('2016-01-01');
  constructor(private service: RestService<AvailabilityDto>, private router: Router, private datePipe: DatePipe) { }

  ngOnInit() { this.fetchDataFromServer(); }

  fetchDataFromServer() {
    let selctedUserId = 3;
    this.service.readUserId.subscribe(userId => {
      selctedUserId = userId;
      this.ngUserId=userId;
    })

    let newUrl = this.getUrl + "&userId=" + selctedUserId;
    this.service.get(newUrl)
      .subscribe(data => {
        this.avList = <AvailabilityDto[]>(data.content);
        this.avList.sort((a, b) => {return (b.id - (a.id))})
    //   if(this.avList&&this.avList.length>0)
    //   {
    //     this.ngUserId=this.avList[0].gskUsersDTO.id;
    //     let dt=new Date(this.avList[0].startTime.toString().substring(0,this.avList[0].startTime.toString().indexOf(' ')))
        
    //     this.dateValue=CommonUtils.getDate(dt,10,10,10)
    // }  
    },
        erro => {
          alert("Is REST API Server Running? Try " + this.getUrl)
        }
      )

  }
  ngOnChanges() {
    console.log("ngOChanges()====INSIDE Availability component.ts..=>refreshAvailabilityComponent= " + this.refreshAvailabilityComponent)

    this.fetchDataFromServer();

  }
  public formatDate(dt: string): Date {
    let dtStr = dt.replace(' ', 'T');
    let dateVal = new Date(dtStr);
    // let dateString =this.datePipe.transform(dateVal,"yyyy-MM-dd'T'HH:mm:ss");
    // console.log(dateVal+" "+dt+"= dateString="+dateString);

    return dateVal
  }

  delete(i: number) {
    let deleteUrl = "http://" + AppProperties.DATA_SERVER_IP + ":" + AppProperties.DATA_SERVER_PORT + "/gskAvail/" + i;
    console.log("=========delete avl with id =" + i)
    let avl = this.avList.find(av => av.id === i);
    console.log(deleteUrl)
    this.service.delete(deleteUrl).subscribe(response => {
      let arrayIndex = this.avList.indexOf(avl);
      this.avList.splice(arrayIndex, 1);

    })
  }
  create() {

  }
  edit(i: number) {
    let editUrl = "http://" + AppProperties.DATA_SERVER_IP + ":" + AppProperties.DATA_SERVER_PORT + "/gskAvail/" + i;
    console.log(editUrl);

  }
  confirm(p: AvailabilityDto) {
    this.service.setIsReservationEditMode(true)
    this.service.setAvailablility(p)
    this.router.navigate(["rsv/show/"], {})
  }



formGroup=new FormGroup({
  pickedDate:new FormControl(),
  userId:new FormControl()
  })
  get pickedDate(){return this.formGroup.get('pickedDate').value}
  get userId(){return this.formGroup.get('userId').value}

  ngUserId=2

  dateValue=new Date();
  showDate()
    {
      Logger.error("+++++avl.comp.TS+++++++picked date "+this.pickedDate);
      
    }
    getData()
    {
      if(this.pickedDate)
      {
      let fromTime = CommonUtils .getDateStr(this.pickedDate, 10, 10,10)
      Logger.error("++++++++++++="+fromTime)
     let  avl2=new AvailabilityDto()
      // avl.gskUsersDTO.id=this.userId;
      avl2.startTime=CommonUtils.getDate(this.pickedDate,10,10,10);
      if(avl2.gskUsersDTO)
      avl2.gskUsersDTO.id=this.ngUserId
      this.service.setAvlSearchParams(avl2)

     let searchUrl = CommonUtils.DATA_BASE_URL+
      //  "/searchAvl/?startTime=2016-01-01";
      // "/searchAvl/?isActive=1";
      "/searchAvl/?startTime="+fromTime+"&userId="+this.userId;
      this.service.get(searchUrl).subscribe(newData=>{
        this.avList=newData;
        Logger.debug(" New Data=>"+JSON.stringify(newData))
      })
     
    }
      Logger.error("+++++avl.comp.TS+++++++picked date "+this.pickedDate+" userId="+this.userId);

    }

  
}
