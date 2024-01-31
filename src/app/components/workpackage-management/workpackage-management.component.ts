import {Component, OnInit} from "@angular/core";
import {LoggerService} from "../../services/logger.service";
import {DynamicDialogConfig} from "primeng/dynamicdialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {GlobalObjectService} from "../../services/global-object.service";
import {Workpackage} from "../../models/Workpackage";
import {Workplan} from "../../models/Workplan";

/**
 * Component regarding the management of a workpackage. Only, description is managed.
 */
@Component({
  selector: "app-workpackage-management",
  templateUrl: "./workpackage-management.component.html",
  styleUrl: "./workpackage-management.component.css"
})
export class WorkpackageManagementComponent implements OnInit {

  private _workplan: Workplan | undefined;
  private _workplanId: string | undefined;
  private _workpackageId: number | undefined;

  private _workpackage: Workpackage | undefined;

  private _onSubmit: ((workpackage: Workpackage) => void) | undefined;


  private _workpackageForm: FormGroup = this.formBuilder.group({
    workpackageName: ["", [Validators.required, Validators.min(4)]],
  });

  constructor(private log: LoggerService,
              private dialogConfig: DynamicDialogConfig,
              private go: GlobalObjectService,
              private formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.workplanId = this.dialogConfig.data.workplanId;
    this.workpackageId = this.dialogConfig.data.workpackageId;

    this.workplan = this.go.getWorkplan(this.workplanId || "");

    this._onSubmit = this.dialogConfig.data._onSubmit;

    this.log.log("Dialog opened params = ", this.workplanId || "", this.workpackageId || 0);

    this.workpackage = this.go.findWorkpackage(this.workplanId || "", this.workpackageId || 0);

    this.workpackageForm.patchValue({
      workpackageName: this.workpackage?.description,
    });
  }

  public get workpackage(): Workpackage | undefined {
    return this._workpackage;
  }

  public set workpackage(value: Workpackage | undefined) {
    this._workpackage = value;
  }

  public get workplanId(): string | undefined {
    return this._workplanId;
  }

  public set workplanId(value: string | undefined) {
    this._workplanId = value;
  }

  public get workpackageId(): number | undefined {
    return this._workpackageId;
  }

  public set workpackageId(value: number | undefined) {
    this._workpackageId = value;
  }

  public get workpackageForm(): FormGroup {
    return this._workpackageForm;
  }

  public set workpackageForm(value: FormGroup) {
    this._workpackageForm = value;
  }

  public get workplan(): Workplan | undefined {
    return this._workplan;
  }

  public set workplan(value: Workplan | undefined) {
    this._workplan = value;
  }

  onSubmitClick(event: any) {
    this.log.log(event);

    if (this._onSubmit) {
      this._onSubmit({
        ...this.workpackage || {
          number: -1,
        },
        description: this.workpackageForm.controls["workpackageName"].value || "",
      })
    }
  }
}
