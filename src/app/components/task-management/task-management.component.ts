import {Component, OnDestroy, OnInit} from "@angular/core";
import {LoggerService} from "../../services/logger.service";
import {DynamicDialogConfig} from "primeng/dynamicdialog";
import {GlobalObjectService} from "../../services/global-object.service";
import {Task} from "../../models/Task";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ConfirmationService, MessageService} from "primeng/api";
import {Period} from "../../models/Period";
import {UtilsService} from "../../services/utils.service";
import {Subscription} from "rxjs";
import {WorkplanManagementService} from "../../services/workplan-management.service";

@Component({
  selector: "app-task-management",
  templateUrl: "./task-management.component.html",
  styleUrl: "./task-management.component.css",
  providers: [ConfirmationService, MessageService]
})
export class TaskManagementComponent implements OnInit, OnDestroy {

  private _workplanId: string | undefined;
  private _workpackageId: number | undefined;
  private _taskId: number | undefined;

  private _task: Task | undefined;

  private _onSubmit: ((task: Task) => void) | undefined;

  private _taskForm: FormGroup = this.formBuilder.group({
    taskName: ["", [Validators.required, Validators.min(4)]],
    periods: this.formBuilder.array([]),
  });

  private $supscriptionMessages: Subscription | undefined;

  constructor(private log: LoggerService,
              private dialogConfig: DynamicDialogConfig,
              private go: GlobalObjectService,
              private formBuilder: FormBuilder,
              private utilsService: UtilsService,
              private workplanManagement: WorkplanManagementService,
  ) {
  }

  ngOnInit() {
    this.workplanId = this.dialogConfig.data.workplanId;
    this.workpackageId = this.dialogConfig.data.workpackageId;
    this.taskId = this.dialogConfig.data.taskId;

    this._onSubmit = this.dialogConfig.data._onSubmit;

    this.log.log("Dialog opened params = ", this.workplanId || "", this.workpackageId || 0, this.taskId || 0);

    this.task = this.go.findTask(this.workplanId || "", this.workpackageId || 0, this.taskId || 0);

    this.log.log("Task = ", this.task);

    this.taskForm.patchValue({
      taskName: this.task?.description,
    });

    this.task?.periods?.forEach(p => {
      (this.taskForm.controls["periods"] as FormArray).push(this.formBuilder.group({
        taskStart: [new Date(p.start), Validators.required],
        taskEnd: [new Date(p.end), Validators.required],
      }));
    });

    this.log.log("Task found = ", this.taskForm);
  }

  ngOnDestroy() {
    if (this.$supscriptionMessages) {
      this.$supscriptionMessages.unsubscribe();
    }
  }

  public get task(): Task | undefined {
    return this._task;
  }

  public set task(value: Task | undefined) {
    this._task = value;
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

  public get taskId(): number | undefined {
    return this._taskId;
  }

  public set taskId(value: number | undefined) {
    this._taskId = value;
  }

  public onConfirm1(event: any) {
    this.log.log(event);
  }

  public get taskForm(): FormGroup {
    return this._taskForm;
  }

  public set taskForm(value: FormGroup) {
    this._taskForm = value;
  }

  public get periodsFormGroups(): FormGroup[] {
    return (this.taskForm.controls["periods"] as FormArray).controls.map(e => e as FormGroup);
  }

  public onSubmitClick(event: any) {
    this.log.log(event);

    if (this._onSubmit) {
      this._onSubmit({
        number: this.taskId,
        description: this.taskForm.controls["taskName"].value,
        periods: (this.taskForm.controls["periods"].value as { taskStart: Date, taskEnd: Date }[]).map(s => {
          return {
            start: s.taskStart,
            end: s.taskEnd,
          };
        }),
      } as Task);
    }
  }

  public onAddPeriod(event: any) {
    (this.taskForm.controls["periods"] as FormArray).push(this.formBuilder.group({
      taskStart: [new Date(), Validators.required],
      taskEnd: [new Date(), Validators.required],
    }))
  }

  public onRemoveClick(event: any, formIndex: number) {
    const period: Period | undefined = this.task?.periods[formIndex];

    this.workplanManagement.confirmation(`Are you sure you want on date period [${this.utilsService.formatDate(period?.start)},
       ${this.utilsService.formatDate(period?.end)}]?`, event, () => {
      (this.taskForm.controls["periods"] as FormArray).removeAt(formIndex, {emitEvent: true});
    })
  }
}
