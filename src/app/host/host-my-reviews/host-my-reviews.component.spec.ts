import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostMyReviewsComponent } from './host-my-reviews.component';

describe('HostMyReviewsComponent', () => {
  let component: HostMyReviewsComponent;
  let fixture: ComponentFixture<HostMyReviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostMyReviewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostMyReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
