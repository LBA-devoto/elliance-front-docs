import { TestBed } from '@angular/core/testing';

import { ChampsdentiteService } from './champsdentite.service';

describe('ChampsdentiteService', () => {
  let service: ChampsdentiteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChampsdentiteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
