import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHostsApproveComponent } from './admin-hosts-approve.component';

describe('AdminHostsApproveComponent', () => {
  let component: AdminHostsApproveComponent;
  let fixture: ComponentFixture<AdminHostsApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminHostsApproveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminHostsApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
