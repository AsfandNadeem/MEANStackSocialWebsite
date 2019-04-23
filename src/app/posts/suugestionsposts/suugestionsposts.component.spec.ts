import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuugestionspostsComponent } from './suugestionsposts.component';

describe('SuugestionspostsComponent', () => {
  let component: SuugestionspostsComponent;
  let fixture: ComponentFixture<SuugestionspostsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuugestionspostsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuugestionspostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
