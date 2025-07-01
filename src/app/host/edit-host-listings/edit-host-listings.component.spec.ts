import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHostListingComponent } from './edit-host-listings.component';

describe('EditHostListingComponent', () => {
  let component: EditHostListingComponent;
  let fixture: ComponentFixture<EditHostListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditHostListingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditHostListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
