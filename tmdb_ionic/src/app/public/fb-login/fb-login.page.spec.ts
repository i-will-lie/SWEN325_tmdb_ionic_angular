import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FbLoginPage } from './fb-login.page';

describe('FbLoginPage', () => {
  let component: FbLoginPage;
  let fixture: ComponentFixture<FbLoginPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FbLoginPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FbLoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
