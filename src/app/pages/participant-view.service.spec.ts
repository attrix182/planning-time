import { TestBed } from '@angular/core/testing';

import { ParticipantViewService } from './participant-view.service';

describe('ParticipantViewService', () => {
  let service: ParticipantViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParticipantViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
