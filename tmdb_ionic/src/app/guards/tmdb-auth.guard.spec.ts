import { TestBed, async, inject } from '@angular/core/testing';

import { TmdbAuthGuard } from './tmdb-auth.guard';

describe('TmdbAuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TmdbAuthGuard]
    });
  });

  it('should ...', inject([TmdbAuthGuard], (guard: TmdbAuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
