import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertiserloginComponent } from './advertiserlogin.component';

describe('AdvertiserloginComponent', () => {
  let component: AdvertiserloginComponent;
  let fixture: ComponentFixture<AdvertiserloginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvertiserloginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvertiserloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
