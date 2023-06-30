import { Component, Input, OnInit, OnChanges, Inject } from '@angular/core';
import { RestService } from 'src/app/services/rest/rest.service';
import { AppProperties } from '../../app.properties'
import { DatePipe } from '@angular/common';
import { ReservationDto } from '../../model/reservation.dto';
import { Logger, CommonUtils } from 'src/app/common/utils';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MailMessageDTO } from '../../model/mail-message.dto';
import { AvailabilityDto } from 'src/app/model/availability.dto';
@Component({
  selector: 'reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css'],
  providers: [DatePipe]

})
export class ReservationComponent implements OnInit {
  @Input()
  refreshRsvComponent = 0
  @Input()
  showRowLayout = true

  getUrl = CommonUtils.DATA_BASE_URL

  public today = new Date('2016-01-01');
  public rsvList: ReservationDto[];

  constructor(
    private service: RestService<ReservationDto>,
    private emailService: RestService<MailMessageDTO>,
    private datePipe: DatePipe,
    private dialog: MatDialog,

  ) { }
  ngOnInit() {

    this.fetchData();
  }

  private SERVICE_MODE = "MONGO";
  setUrl() {
    this.service.readServiceMode.subscribe(mode => {

      this.SERVICE_MODE = mode;
    })

    if (this.SERVICE_MODE === "JPA" && this.getUrl.indexOf("/jpaSearchRsv/") === -1)
      this.getUrl = this.getUrl + "/jpaSearchRsv/?isActive=1";
    else if (this.SERVICE_MODE === "MONGO" && this.getUrl.indexOf("/mongoRsv/") === -1)
      this.getUrl = this.getUrl + "/mongoRsv/?isActive=1";

  }

  fetchData() {
    this.setUrl();
    let selctedUserId = 3;
    this.service.readUserId.subscribe(userId => {
      selctedUserId = userId;
    })

    let newUrl = this.getUrl + "&userId=" + selctedUserId;
    Logger.error(">>>>>>>>>>>>>>> reservation get url " + newUrl)
    this.service.get(newUrl)
      .subscribe(data => {
        if (this.SERVICE_MODE === "JPA")
          this.rsvList = <ReservationDto[]>(data.content);
        else if (this.SERVICE_MODE === "MONGO")
          this.rsvList = <ReservationDto[]>(data);
        if (this.rsvList)
          this.rsvList.sort((a, b) => { return (b.id - a.id) })
      },
        erro => {
          alert(this.SERVICE_MODE + "=SERVICE_MODE\nIs REST API Server Running? Try " + newUrl)
        }
      )

  }
  ngOnChanges() {
    this.fetchData();
    Logger.error("---ReserevationComponent.Ts+++==>ngOnChanges()=>>>CHANGE_NTIFICATION_RECEIVED")
  }
  formatDate(dt: Date): string {

    let dtStr = dt.toString().replace(' ', "'T'");
    // let dateVal= new Date(dtStr);
    let dateString = this.datePipe.transform(dtStr, "yyyy-MM-dd'T'HH:mm:ss");
    // console.log(dateVal+" "+dt+"= dateString="+dateString);

    return dateString
  }


  cancel(p: ReservationDto): void {
    Logger.debug("To be cancelled =>" + JSON.stringify(p))
    let emailUrl = CommonUtils.DATA_BASE_URL + "/sendEmail/";
    let ms = new MailMessageDTO();
    ms.recipient = p.email;
    ms.subject = "RE:Cancelation of  " + p.title;

    const dialogRef = this.dialog.open(EmailDialogComponent, {
      width: '600px',
      height: '430px',
      data: ms,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

      ms = result;


      if (ms && ms.recipient && ms.subject && ms.mailBody) {

        let mailMsg = {
          "recipient": ms.recipient,
          "subject": ms.subject,
          "mailBody": ms.mailBody,
          "attachment": ""

        }

        this.emailService.post(emailUrl, mailMsg).subscribe(emailSentResponse => {
          Logger.debug("EMAIL_RESPONSE_FROM_SERVER=" + emailSentResponse)
          // update reservation 

          let updateUrl = CommonUtils.DATA_BASE_URL
          if (this.SERVICE_MODE === "JPA" && updateUrl.indexOf("/jpaReserv/") === -1)
            updateUrl = updateUrl + "/jpaReserv/"
          else if (this.SERVICE_MODE === "MONGO" && updateUrl.indexOf("/mongoReserv/") === -1)
            updateUrl = updateUrl + "/mongoReserv/"
          p.isComplete = 0;
          p.isActive = 0;
          p.isMissed=0;
          p.isCancelled=1;
          this.service.update(updateUrl, p).subscribe(resp => {
            Logger.debug("UPDATED =>" + JSON.stringify(p))

          })





        },
          error => {
            Logger.debug("ERROR_RETURNED_FROM_SERVER=>" + error)
          })

      }

    });
  }
  markMissed(p: ReservationDto): void {
    let updateUrl = CommonUtils.DATA_BASE_URL
    if (this.SERVICE_MODE === "JPA" && updateUrl.indexOf("/jpaReserv/") === -1)
      updateUrl = updateUrl + "/jpaReserv/"
    else if (this.SERVICE_MODE === "MONGO" && updateUrl.indexOf("/mongoReserv/") === -1)
      updateUrl = updateUrl + "/mongoReserv/"
      p.isComplete = 0;
      p.isActive = 0;
      p.isMissed=1;
      p.isCancelled=0;
this.service.update(updateUrl, p).subscribe(resp => {
      Logger.debug("UPDATED =>" + JSON.stringify(p))
    })
  }
  markCompleted(p: ReservationDto): void {
    let updateUrl = CommonUtils.DATA_BASE_URL
    if (this.SERVICE_MODE === "JPA" && updateUrl.indexOf("/jpaReserv/") === -1)
      updateUrl = updateUrl + "/jpaReserv/"
    else if (this.SERVICE_MODE === "MONGO" && updateUrl.indexOf("/mongoReserv/") === -1)
      updateUrl = updateUrl + "/mongoReserv/"
      p.isComplete = 1;
      p.isActive = 0;
      p.isMissed=0;
      p.isCancelled=0;
this.service.update(updateUrl, p).subscribe(resp => {
      Logger.debug("UPDATED =>" + JSON.stringify(p))

    })
  }
  delete(p) {


    let deleteUrl = CommonUtils.DATA_BASE_URL
    if (this.SERVICE_MODE === "JPA" && deleteUrl.indexOf("/jpaReserv/") === -1)
      deleteUrl = deleteUrl + "/jpaReserv/"
    else if (this.SERVICE_MODE === "MONGO" && deleteUrl.indexOf("/mongoReserv/") === -1)
      deleteUrl = deleteUrl + "/mongoReserv/"
    deleteUrl = deleteUrl + p.id
    let avl = this.rsvList.find(av => av.id === p.id);

    // let deletedRsv = this.rsvList.find(rsv => { rsv.id === p.id })
    let index = this.rsvList.indexOf(avl);

    // if (this.SERVICE_MODE === 'MONGO')
    this.service.delete(deleteUrl).subscribe(resp => {
      this.rsvList.splice(index, 1);
      Logger.error(" p=" + JSON.stringify(p))
      Logger.error("=============== fix avl and rsv for user id =" + p.usersDTO.id)
      this.fixReservCount(p.usersDTO.id)
    })

  }


  fixReservCount(userId: number) {
    Logger.error(".....................fixReservCount after deletion ")
    let reservList: ReservationDto[];
    let rsvGetUrl = CommonUtils.DATA_BASE_URL;
    if (this.SERVICE_MODE === "JPA" && rsvGetUrl.indexOf("/jpaSearchRsv/") === -1)
      rsvGetUrl = rsvGetUrl + "/jpaSearchRsv/?isActive=1";
    else if (this.SERVICE_MODE === "MONGO" && rsvGetUrl.indexOf("/mongoRsv/") === -1)
      rsvGetUrl = rsvGetUrl + "/mongoRsv/";

    rsvGetUrl = rsvGetUrl + "?userId=" + userId;
    this.service.get(rsvGetUrl)
      .subscribe(data => {
        if (this.SERVICE_MODE === "JPA")
          reservList = <ReservationDto[]>(data.content);
        else if (this.SERVICE_MODE === "MONGO")
          reservList = <ReservationDto[]>(data);
        if (reservList) {
          //  issue server request to fix the availablity count in user
          this.service.get(CommonUtils.DATA_BASE_URL + "/mongoUsers/" + userId).subscribe(u => {
            Logger.debug("Find******** user=" + JSON.stringify(u));;
            u.reservCount = reservList.length;
            this.service.update(CommonUtils.DATA_BASE_URL + "/mongoUsers/", u).subscribe(resp => {
              Logger.debug("******** updated user =" + JSON.stringify(resp))
            })
          })

        }

      }
      )
  }






}
@Component({
  selector: 'email-dialog',
  templateUrl: 'email-dialog.component.html',
})
export class EmailDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EmailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MailMessageDTO,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

