import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { AvailabilityDto } from '../../model/availability.dto';
import { Logger } from 'src/app/common/utils';
import { UsersDto } from 'src/app/model/users.dto';

@Injectable({
  providedIn: 'root'
})
export class RestService<T> {

  constructor(private httpClient: HttpClient) { }


  avlSearchParamsBehaviourSubject = new BehaviorSubject<AvailabilityDto>(null)
  readAvlSearchParams = this.avlSearchParamsBehaviourSubject.asObservable();
  setAvlSearchParams(avl: AvailabilityDto) {
    this.availabilityBehaviourSubject.next(avl);
    Logger.debug("SERVICE====RECEIVE======avl="+JSON.stringify(avl))
  }
  // pass UserId between components 
  userIdBehaviourSubject = new BehaviorSubject<number>(1);
  readUserId = this.userIdBehaviourSubject.asObservable();
  setUserId(userId: number) {
    this.userIdBehaviourSubject.next(userId);
    console.log("SERVICE===RECEIVE=====UserId=" + userId)
  }
  // private loggedInUser:UsersDto;
  loggedInUserBehaviourSubject =new BehaviorSubject<UsersDto>(new UsersDto());
  readLoggedInUser=this.loggedInUserBehaviourSubject.asObservable();
  setLoggedInUser()
  {

    this.loggedInUserBehaviourSubject.next(JSON.parse(localStorage.getItem("u")));


  }setNullLoggedInUser()
  {

    this.loggedInUserBehaviourSubject.next(null);


  }
  // pass Service mode between components
  serviceModeBehaviourSubject =new BehaviorSubject<string>
  // ("JPA")
  ("MONGO");
  readServiceMode=this.serviceModeBehaviourSubject.asObservable();
  setServiceMode(serviceMode:string)
  {
    this.serviceModeBehaviourSubject.next(serviceMode);
    console.log("SERVICE===received SERVICE_MODE =" + serviceMode);

  }

  // pass selected date between compoments
  selectedDateBehaviourSubject = new BehaviorSubject<Date>(new Date());
  readSelectedDate = this.selectedDateBehaviourSubject.asObservable();
  setSelectedDate(selectedDate: Date) {
    this.selectedDateBehaviourSubject.next(selectedDate);
    console.log("SERVICE===received date =" + selectedDate.toDateString());
  }

  // pass isReservationEditmode  for reservation 
  isReservationEditmode = new BehaviorSubject<boolean>(false);
  readIsReservationEditMode = this.isReservationEditmode.asObservable();
  setIsReservationEditMode(no: boolean) {
    this.isReservationEditmode.next(no);
  }
  availabilityBehaviourSubject = new BehaviorSubject<AvailabilityDto>(new AvailabilityDto);
  readAvailability = this.availabilityBehaviourSubject.asObservable();
  setAvailablility(availability: AvailabilityDto) {
    this.availabilityBehaviourSubject.next(availability);
    console.log("SERVICE===received AVL =>" + JSON.stringify(availability))
  }


  get(url: string): Observable<any> {
    console.log("SERVICE===>get()->" + url)
    return this.httpClient.get(url);
  }
  save(url: string, data: T): Observable<any> {
    console.log("SERVICE===>Save()->" + url)
    let headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json;charset=utf-8');
    return this.httpClient.post(url, data, { headers: headers });
  }

 post(url: string, data: T): Observable<any> {
    console.log("SERVICE===>POST()->" + url)
    let headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json;charset=utf-8');
    return this.httpClient.post(url, data, { headers: headers });
  }

  update(url: string, data: T): Observable<any> {
    console.log("SERVICE===>update()->" + url)
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json;charset=utf-8');

    return this.httpClient.put(url, JSON.stringify(data), { headers: headers });
  }

  delete(url: string): Observable<any> {
    console.log("SERVICE===>delete()->" + url)
    return this.httpClient.delete(url)
  }

}
