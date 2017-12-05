import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotAPageComponent } from './not-a-page.component';

describe('NotAPageComponent', () => {
  let component: NotAPageComponent;
  let fixture: ComponentFixture<NotAPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotAPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotAPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
