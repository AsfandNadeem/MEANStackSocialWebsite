import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertisersignupComponent } from './advertisersignup.component';

describe('AdvertisersignupComponent', () => {
  let component: AdvertisersignupComponent;
  let fixture: ComponentFixture<AdvertisersignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvertisersignupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvertisersignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
