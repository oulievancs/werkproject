import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkpackgesListComponent } from './workpackges-list.component';

describe('WorkpackgeListComponent', () => {
  let component: WorkpackgesListComponent;
  let fixture: ComponentFixture<WorkpackgesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkpackgesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkpackgesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
