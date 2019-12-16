import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddonsMarketingAutomationComponent } from './marketing-automation.component';

describe('AddonsMarketingAutomationComponent', () => {
  let component: AddonsMarketingAutomationComponent;
  let fixture: ComponentFixture<AddonsMarketingAutomationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddonsMarketingAutomationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddonsMarketingAutomationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
