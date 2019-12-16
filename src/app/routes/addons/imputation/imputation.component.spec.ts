import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImputationComponent } from './imputation.component';

describe('ImputationComponent', () => {
  let component: ImputationComponent;
  let fixture: ComponentFixture<ImputationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImputationComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImputationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

/*this.tickets = await this.http.get(`/tickets`).pipe(
  map(e => e.map(y => {
    const data = new Imputation(y);
    this.editCache[data.id.toString()] = {
      edit: false,
      data
    }
    return data;
  }))
).toPromise(); */


// this.tasks = await this.http.get(`/tasks`).toPromise();
