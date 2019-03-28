import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertisepostComponent } from './advertisepost.component';

describe('AdvertisepostComponent', () => {
  let component: AdvertisepostComponent;
  let fixture: ComponentFixture<AdvertisepostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvertisepostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvertisepostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
