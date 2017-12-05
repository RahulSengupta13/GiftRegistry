import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewsharedregistriesComponent } from './viewsharedregistries.component';

describe('ViewsharedregistriesComponent', () => {
  let component: ViewsharedregistriesComponent;
  let fixture: ComponentFixture<ViewsharedregistriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewsharedregistriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewsharedregistriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
