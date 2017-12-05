import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateregistryComponent } from './createregistry.component';

describe('CreateregistryComponent', () => {
  let component: CreateregistryComponent;
  let fixture: ComponentFixture<CreateregistryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateregistryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateregistryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
