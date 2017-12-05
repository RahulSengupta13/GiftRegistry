import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewregistryComponent } from './viewregistry.component';

describe('ViewregistryComponent', () => {
  let component: ViewregistryComponent;
  let fixture: ComponentFixture<ViewregistryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewregistryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewregistryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
