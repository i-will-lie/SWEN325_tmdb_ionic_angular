import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TmdbLoginPage } from './tmdb-login.page';

describe('TmdbLoginPage', () => {
  let component: TmdbLoginPage;
  let fixture: ComponentFixture<TmdbLoginPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TmdbLoginPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TmdbLoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
