import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostRoomsComponent } from './host-rooms.component';

describe('HostRoomsComponent', () => {
  let component: HostRoomsComponent;
  let fixture: ComponentFixture<HostRoomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostRoomsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostRoomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
