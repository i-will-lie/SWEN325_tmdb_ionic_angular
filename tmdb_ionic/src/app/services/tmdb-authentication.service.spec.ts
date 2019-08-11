import { TestBed } from '@angular/core/testing';

import { TmdbAuthenticationService } from './tmdb-authentication.service';

describe('TmdbAuthenticationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TmdbAuthenticationService = TestBed.get(TmdbAuthenticationService);
    expect(service).toBeTruthy();
  });
});
