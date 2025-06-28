import { TestBed } from '@angular/core/testing';

import { CreatelistingserviceService } from './createlistingservice.service';

describe('CreatelistingserviceService', () => {
  let service: CreatelistingserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreatelistingserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
