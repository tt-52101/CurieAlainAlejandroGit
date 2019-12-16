import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallModalFormComponent } from './call-modal-form.component';

describe('CallModalFormComponent', () => {
  let component: CallModalFormComponent;
  let fixture: ComponentFixture<CallModalFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallModalFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallModalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
