import {ComponentFixture, TestBed} from "@angular/core/testing";

import {WorkplanManagementComponent} from "./workplan-management.component";

describe("WorkpackegeManagementComponent", () => {
  let component: WorkplanManagementComponent;
  let fixture: ComponentFixture<WorkplanManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkplanManagementComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(WorkplanManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
