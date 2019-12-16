import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriveCredentialsComponent } from './drive-credentials.component';

describe('DriveCredentialsComponent', () => {
  let component: DriveCredentialsComponent;
  let fixture: ComponentFixture<DriveCredentialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriveCredentialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriveCredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
