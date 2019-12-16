import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewsiteComponent } from './viewsite.component';

describe('ViewsiteComponent', () => {
  let component: ViewsiteComponent;
  let fixture: ComponentFixture<ViewsiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewsiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewsiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
