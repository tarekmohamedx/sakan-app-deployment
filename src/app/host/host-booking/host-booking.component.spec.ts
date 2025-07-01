import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostBookingComponent } from './host-booking.component';

describe('HostBookingComponent', () => {
  let component: HostBookingComponent;
  let fixture: ComponentFixture<HostBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostBookingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
