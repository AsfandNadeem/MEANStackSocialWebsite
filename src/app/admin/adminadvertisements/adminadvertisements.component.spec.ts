import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminadvertisementsComponent } from './adminadvertisements.component';

describe('AdminadvertisementsComponent', () => {
  let component: AdminadvertisementsComponent;
  let fixture: ComponentFixture<AdminadvertisementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminadvertisementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminadvertisementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
