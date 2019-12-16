import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CnConfComponent } from './cn-conf.component';

describe('CnConfComponent', () => {
  let component: CnConfComponent;
  let fixture: ComponentFixture<CnConfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CnConfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CnConfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
