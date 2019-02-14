import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedpostsComponent } from './archivedposts.component';

describe('ArchivedpostsComponent', () => {
  let component: ArchivedpostsComponent;
  let fixture: ComponentFixture<ArchivedpostsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchivedpostsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivedpostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
