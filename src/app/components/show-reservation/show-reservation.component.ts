import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-show-reservation',
  templateUrl: './show-reservation.component.html',
  styleUrls: ['./show-reservation.component.css']
})
export class ShowReservationComponent implements OnInit {

  counter = 0;
  notifyReservationCreated = 0
  constructor() { }

  ngOnInit() {
  }
  catchReservatonCreatedNotification($event) {
    this.counter += 1;
    this.notifyReservationCreated = this.counter;
  }
}
