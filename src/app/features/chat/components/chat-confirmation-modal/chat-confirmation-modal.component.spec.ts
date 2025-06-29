import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatConfirmationModalComponent } from './chat-confirmation-modal.component';

describe('ChatConfirmationModalComponent', () => {
  let component: ChatConfirmationModalComponent;
  let fixture: ComponentFixture<ChatConfirmationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatConfirmationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
