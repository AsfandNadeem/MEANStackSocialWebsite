import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertiserpageComponent } from './advertiserpage.component';

describe('AdvertiserpageComponent', () => {
  let component: AdvertiserpageComponent;
  let fixture: ComponentFixture<AdvertiserpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvertiserpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvertiserpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
