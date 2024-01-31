import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkpackageManagementComponent } from './workpackage-management.component';

describe('WorkpackageManagementComponent', () => {
  let component: WorkpackageManagementComponent;
  let fixture: ComponentFixture<WorkpackageManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkpackageManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkpackageManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
