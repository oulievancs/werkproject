import {Component, OnInit} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {GlobalObjectService} from "../../services/global-object.service";
import {ActivatedRoute, Router} from "@angular/router";
import {BackendService} from "../../services/backend-service";
import {LoggerService} from "../../services/logger.service";

/**
 * Component regarding the main page. On the first step,
 * the description of the workplan is managed.
 */
@Component({
  selector: "app-workplan-management",
  templateUrl: "./workplan-management.component.html",
  styleUrl: "./workplan-management.component.css"
})
export class WorkplanManagementComponent implements OnInit {

  public form = this.fb.group({
    workplanName: ["", [Validators.required, Validators.min(4)]],
  });

  constructor(private fb: FormBuilder,
              private go: GlobalObjectService,
              private router: Router,
              private route: ActivatedRoute,
              private log: LoggerService,
              private backendService: BackendService) {
  }

  public submit(event: any): void {
    console.log("form = ", this.form.getRawValue());

    const id: string = this.go.initWorkplan({
      title: this.form.getRawValue().workplanName || "",
      workpackages: this.go.generateRandomWorkPackages()
    });

    this.navigateToWorkplan(id);
  }

  ngOnInit(): void {
  }

  public onSerchBE(event: any) {
    const workplanId = this.form.getRawValue().workplanName || "";

    this.backendService.getWorkplan(workplanId)
      .subscribe({
        next: (response) => {
          this.go.updateWorkplan(workplanId, response);

          this.navigateToWorkplan(workplanId);
        },
        error: (error) => {
          this.log.error(`Error from respsonse getting workplanId = ${workplanId}.`);
        }
      })
  }

  private navigateToWorkplan(workplanId: string) {
    this.router.navigate(["workpackages-list"], {queryParams: {id: workplanId}});
  }
}
