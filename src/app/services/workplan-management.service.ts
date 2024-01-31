import {Injectable} from "@angular/core";
import {map, Observable} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {Workplan} from "../models/Workplan";
import {Workpackage} from "../models/Workpackage";
import {LoggerService} from "./logger.service";
import {GlobalObjectService} from "./global-object.service";
import {ConfirmationService, MessageService, TreeNode} from "primeng/api";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {TaskManagementComponent} from "../components/task-management/task-management.component";
import {Task} from "../models/Task";
import {WorkpackageManagementComponent} from "../components/workpackage-management/workpackage-management.component";
import {UtilsService} from "./utils.service";

@Injectable({
  providedIn: "root"
})
export class WorkplanManagementService {

  constructor(private log: LoggerService,
              private go: GlobalObjectService,
              private dialogService: DialogService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService,
              private utilsService: UtilsService,
  ) {
  }

  public getWorkplanByRoute(route: ActivatedRoute): Observable<{ idStorage: string, workplan?: Workplan } | undefined> {
    return route.queryParams.pipe(
      map(params => {
        const workplanId = String(params["id"]);

        const workplan: Workplan | undefined = this.go.getWorkplan(workplanId);

        this.log.log("id got = ", workplanId, " all params = ", params, " workplan = ", workplan);

        return {
          idStorage: workplanId,
          workplan: workplan,
        };
      }),
    );
  }

  public getFileTree(workplan?: Workplan) {
    return {
      treeFile: this.workpackagesToFile(workplan && workplan.workpackages ? workplan.workpackages : []),
      workPlan: workplan,
    };
  }

  public getFileWorkpackageTree(workplan?: Workplan, workpackageId?: number) {
    const workpackage: Workpackage | undefined = workplan?.workpackages?.find(wp => wp.number === workpackageId);
    return {
      treeFile: this.workpackagesToFile(workpackage ? [workpackage] : []).at(0)?.children,
      workPlan: workplan,
    };
  }

  /**
   * {@link TreeNode}.
   * @param workpackages the [] of {@link Workpackage}s.
   * @private.
   */
  private workpackagesToFile(workpackages: Workpackage[]): TreeNode[] {
    return workpackages.map(w => {
      return {
        leaf: false,
        key: w.number.toString(),
        label: `WP ${w.number} - ${w.description}`,
        data: {
          label: `WP ${w.number} - ${w.description}`,
          workpackage: {
            ...w,
          },
          dateSt: this.utilsService.formatDate(
            w.period?.start,
            "short"
          ),
          dateEnd: this.utilsService.formatDate(
            w.period?.end,
            "short"
          )
        },
        children: w.tasks?.map(t => {
          return {
            leaf: true,
            key: `${w.number}.${t.number}`,
            label: `TSK ${w.number}.${t.number} - ${t.description}`,
            data: {
              label: `TSK ${w.number}.${t.number} - ${t.description}`,
              dateSt: this.utilsService.formatDate(
                new Date(Math.min.apply(null, t.periods.map(p => p.start ? new Date(p.start).getTime() : 0))),
                "short"
              ),
              dateEnd: this.utilsService.formatDate(
                new Date(Math.max.apply(null, t.periods.map(p => p.end ? new Date(p.end).getTime() : 0))),
                "short"
              ),
              workpackage: {
                ...w,
              },
              task: {
                ...t,
              },
            },
          };
        }),
      };
    });
  }

  public openTaskDialog(workplanId: string, workpackageId: number, taskId: number,
                        workplanGetter: Workplan | undefined, workplanIdSetter: ((workplanId: string) => void)[]): DynamicDialogRef {
    return this.dialogService.open(TaskManagementComponent, {
      header: "Manage the Task",
      width: "70%",
      contentStyle: {overflow: "auto"},
      baseZIndex: 10000,
      maximizable: false,
      data: {
        workplanId,
        workpackageId,
        taskId,
        _onSubmit: (task: Task) => {
          if (task) {
            this.log.log("Task commited = ", task);
          }

          const workpackage: Workpackage | undefined =
            workplanGetter?.workpackages?.find(wp => wp.number === workpackageId);


          const vtask: Task | undefined = (workpackage?.tasks?.find(t => t.number === taskId));

          if (vtask) {
            vtask.description = task.description;
            vtask.periods = task.periods;
          } else {
            workplanGetter?.workpackages?.find(wp => wp.number === workpackageId)?.tasks?.push({
              number: task.number < 0 ? Math.max.apply(null, workpackage?.tasks?.map(t => t.number) || [0]) + 1 : task.number,
              description: task.description,
              periods: task.periods,
            });
          }
          if (workplanGetter) {
            workplanIdSetter.forEach(e => e(this.go.updateWorkplan(workplanId || "", workplanGetter)));
          }
        }
      },
    });
  }

  public openWorkpackageDialog(workplanId: string, workpackageId: number,
                               workplanGetter: Workplan | undefined, workplanIdSetter: ((workplanId: string) => void)[]): DynamicDialogRef {
    return this.dialogService.open(WorkpackageManagementComponent, {
      header: "Manage the Workpackage",
      width: "70%",
      contentStyle: {overflow: "auto"},
      baseZIndex: 10000,
      maximizable: false,
      data: {
        workplanId,
        workpackageId,
        _onSubmit: (workpackage: Workpackage) => {
          if (workpackage) {
            this.log.log("Workpackage commited = ", workpackage);
          }

          const vworkpackage: Workpackage | undefined =
            workplanGetter?.workpackages?.find(wp => wp.number === workpackageId);

          if (vworkpackage) {
            vworkpackage.description = workpackage.description;
          } else {
            workplanGetter?.workpackages?.push({
              number: Math.max.apply(null, workplanGetter?.workpackages?.map(t => t.number) || [0]) + 1,
              description: workpackage.description,
              tasks: [],
            });
          }

          if (workplanGetter) {
            workplanIdSetter.forEach(e => e(this.go.updateWorkplan(workplanId || "", workplanGetter)));
          }
        }
      },
    });
  }

  public confirmation(message: string, event: any, accept: () => void, reject?: () => void) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: message,
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        accept();

        this.messageService.clear();
        this.messageService.add({
          severity: "info",
          summary: "Confirmed",
          detail: "You have accepted",
          life: 3000
        });
      },
      reject: () => {
        this.messageService.clear();
        this.messageService.add({severity: "error", summary: "Rejected", detail: "You have rejected", life: 3000});
      }
    });
  }

  public deleteWorkpackage(workplanId: string, workpackageNumber: number): {
    treeFile: TreeNode[],
    workPlan: Workplan | undefined
  } {
    const workplan: Workplan | undefined = this.go.getWorkplan(workplanId);
    const workpackages: Workpackage[] = workplan?.workpackages || [];

    const index = workpackages.findIndex(v => v.number === workpackageNumber);

    index > -1 ? workpackages.splice(index, 1) : workpackages;

    if (workplan) {
      this.go.updateWorkplan(workplanId, {
        ...workplan,
        workpackages: workpackages
      });
    }

    return this.getFileTree(workplan);
  }

  public deleteTask(workplanId: string, workpackageNumber: number, taskNumber: number): {
    treeFile: TreeNode[],
    workPlan: Workplan | undefined
  } {
    const workplan: Workplan | undefined = this.go.getWorkplan(workplanId);
    const workpackages: Workpackage[] = workplan?.workpackages || [];

    const index = workpackages.findIndex(v => v.number === workpackageNumber);

    const vIndex1 = workpackages[index].tasks?.findIndex(v => v.number === taskNumber);
    const taskIndex = vIndex1 !== undefined && vIndex1 > -1 ? vIndex1 : -1;

    taskIndex > -1 && index > -1 ? workpackages[index].tasks?.splice(taskIndex, 1) : workpackages[index].tasks || [];

    if (workplan) {
      this.go.updateWorkplan(workplanId, {
        ...workplan,
        workpackages: workpackages
      });
    }

    return this.getFileTree(workplan);
  }
}
