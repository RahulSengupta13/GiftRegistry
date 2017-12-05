import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchregistryComponent } from './searchregistry.component';

describe('SearchregistryComponent', () => {
  let component: SearchregistryComponent;
  let fixture: ComponentFixture<SearchregistryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchregistryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchregistryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
