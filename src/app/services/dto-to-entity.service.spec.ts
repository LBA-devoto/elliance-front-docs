import { TestBed } from '@angular/core/testing';

import { DtoToEntityService } from './dto-to-entity.service';

describe('DtoToEntityService', () => {
  let service: DtoToEntityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DtoToEntityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
