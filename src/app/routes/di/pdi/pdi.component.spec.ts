import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdiComponent } from './pdi.component';

describe('PdiComponent', () => {
  let component: PdiComponent;
  let fixture: ComponentFixture<PdiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
