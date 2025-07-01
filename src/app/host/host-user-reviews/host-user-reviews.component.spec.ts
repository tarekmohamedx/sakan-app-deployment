import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostUserReviewsComponent } from './host-user-reviews.component';

describe('HostUserReviewsComponent', () => {
  let component: HostUserReviewsComponent;
  let fixture: ComponentFixture<HostUserReviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostUserReviewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostUserReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
