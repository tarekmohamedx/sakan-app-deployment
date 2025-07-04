import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditlistingComponent } from './admin-editlisting.component';

describe('AdminEditlistingComponent', () => {
  let component: AdminEditlistingComponent;
  let fixture: ComponentFixture<AdminEditlistingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEditlistingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEditlistingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
