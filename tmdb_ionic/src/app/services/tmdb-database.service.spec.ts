import { TestBed } from '@angular/core/testing';

import { TmdbDatabaseService } from './tmdb-database.service';

describe('TmdbDatabaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TmdbDatabaseService = TestBed.get(TmdbDatabaseService);
    expect(service).toBeTruthy();
  });
});
