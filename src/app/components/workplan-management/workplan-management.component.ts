import {Component, OnInit} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {GlobalObjectService} from "../../services/global-object.service";
import {ActivatedRoute, Router} from "@angular/router";

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
              private route: ActivatedRoute) {
  }

  public submit(event: any): void {
    console.log("form = ", this.form.getRawValue());

    const id: string = this.go.initWorkplan({
      title: this.form.getRawValue().workplanName || "",
      workpackages: this.go.generateRandomWorkPackages()
    });

    this.router.navigate(["workpackages-list"], {queryParams: {id: id}});
  }

  ngOnInit(): void {
  }
}
