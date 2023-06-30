import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAvailabilityComponent } from './show-availability.component';

describe('ShowAvailabilityComponent', () => {
  let component: ShowAvailabilityComponent;
  let fixture: ComponentFixture<ShowAvailabilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowAvailabilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
