import {Component, OnInit} from "@angular/core";
import {map} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {Workplan} from "../../models/Workplan";
import {LoggerService} from "../../services/logger.service";
import {WorkplanManagementService} from "../../services/workplan-management.service";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {ConfirmationService, MessageService, TreeNode} from "primeng/api";
import {Column} from "../../models/Column";
import {GlobalObjectService} from "../../services/global-object.service";
import {BackendService} from "../../services/backend-service";

/**
 * Component regarding the management of the main list of workpackages and tasks,
 * regarding one workplan.
 */
@Component({
  selector: "app-workpackges-list",
  templateUrl: "./workpackges-list.component.html",
  styleUrl: "./workpackges-list.component.css",
  providers: [DialogService, WorkplanManagementService, ConfirmationService, MessageService]
})
export class WorkpackgesListComponent implements OnInit {

  private ref: DynamicDialogRef | undefined;

  private _workplan: Workplan | undefined;
  private _files: TreeNode[] | undefined;
  private _selectedFile: any | undefined;

  private _selectedColumns: Column[] | undefined;
  private _cols: Column[] | undefined;
  private _workplanId: string | undefined;

  private _nodeExpand: TreeNode | undefined;

  private bindWorkplan: () => Workplan | undefined = this.getWorkplan.bind(this);

  private bindUpdateWorkplan: (workplanId: string) => void = this.updateWorkplan.bind(this);

  constructor(private workplanManagement: WorkplanManagementService,
              private route: ActivatedRoute,
              private log: LoggerService,
              private go: GlobalObjectService,
              private backendService: BackendService) {
  }

  ngOnInit() {
    this.cols = [
      {
        header: "Task Name",
        field: "label",
      },
      {
        header: "Date Start",
        field: "dateSt",
      },
      {
        header: "Date End",
        field: "dateEnd",
      }
    ];


    this.selectedColumns = this.cols;

    this.workplanManagement.getWorkplanByRoute(this.route).pipe(
      map(workplan => {
        this._workplanId = workplan?.idStorage;

        return this.workplanManagement.getFileTree(workplan?.workplan);
      }),
    ).subscribe(tree => {
      this.fillFromTreeFile(tree?.treeFile, tree?.workPlan);
    });
  }

  private fillFromTreeFile(tree: TreeNode[], workplan: Workplan | undefined) {
    this.log.log("tree = ", tree);
    this._workplan = workplan;
    this._files = tree;

    if (this._nodeExpand) {
      this._files.forEach(file => {
        if (file.key === this._nodeExpand?.key) {
          file.expanded = true;
        }
      });
    }
  }

  public get files(): TreeNode[] | undefined {
    return this._files;
  }

  public onNodeSelect(event: any) {
    this.selectedFile = event?.node;

    const isChild = !this.selectedFile?.children;

    console.log("SELECT", event, this.selectedFile, "IS CHILD = ", isChild);
  }

  public nodeUnselect(event: any) {
    this.selectedFile = undefined;
  }

  public get workplan(): Workplan | undefined {
    return this._workplan;
  }

  public get selectedFile(): any {
    return this._selectedFile;
  }

  public set selectedFile(value: any) {
    this._selectedFile = value;
  }

  public get selectedColumns(): Column[] | undefined {
    return this._selectedColumns;
  }

  public set selectedColumns(value: Column[]) {
    this._selectedColumns = value;
  }

  public get cols(): Column[] | undefined {
    return this._cols;
  }

  public set cols(value: Column[]) {
    this._cols = value;
  }

  public getWorkplan(): Workplan | undefined {
    return this.workplan;
  }

  public onAddClick(event: any) {
    this.log.log(event);

    this.onEditWorkpackage(event, {workpackage: 0});
  }

  public onSaveClick(event: any) {
    this.log.log("The whole workplan is about to be sent to backend.", this.workplan);

    // Send to backend via Backend service.
    if (this.workplan) {
      this.backendService.sendWorkplan(this.workplan).subscribe({
        next: (response) => {
          this.log.log("The response was = ", response);
        },
        error: (error) => {
          this.log.error("The error from the server was = ", error);
        }
      });
    }
  }

  public onEditTask(ev: any, params: any) {
    this.log.log("Params = ", params);

    if (this._workplanId) {
      const ref: DynamicDialogRef = this.workplanManagement.openTaskDialog(this._workplanId, params?.workpackage?.number, params?.task?.number,
        this.workplan, [workplanId => {
          if (ref) {
            ref.close({});
          }

        }, this.bindUpdateWorkplan]);
    }
  }

  public onEditWorkpackage(ev: any, params: any) {
    this.log.log("Params = ", params);

    if (this._workplanId) {
      const df: DynamicDialogRef = this.workplanManagement.openWorkpackageDialog(this._workplanId, params?.workpackage?.number,
        this.workplan, [workplanId => {
          if (df) {
            df.close({});
          }
        }, this.bindUpdateWorkplan]);
    }
  }

  public onRemoveWorkpackage(ev: any, params: any) {
    this.log.log("Params = ", params);

    this.workplanManagement.confirmation(`Are you sure you want to delete workpackage
    ${params.label}?`, ev, () => {
      const res: {
        treeFile: TreeNode[],
        workPlan: Workplan | undefined
      } = this.workplanManagement.deleteWorkpackage(this._workplanId || "", params?.workpackage?.number || 0)

      this.fillFromTreeFile(res?.treeFile, res?.workPlan);
    });
  }

  public onRemoveTask(ev: any, params: any) {
    this.log.log("Params = ", params);

    this.workplanManagement.confirmation(`Are you sure you want to delete task
    ${params.label}?`, ev, () => {
      const res: {
        treeFile: TreeNode[],
        workPlan: Workplan | undefined
      } = this.workplanManagement.deleteTask(this._workplanId || "",
        params?.workpackage?.number || 0,
        params?.task?.number || 0
      )

      this.fillFromTreeFile(res?.treeFile, res?.workPlan);
    });
  }

  public onAddTaskClick(ev: any, params: any) {
    const df: DynamicDialogRef = this.workplanManagement.openTaskDialog(this._workplanId || "", params?.workpackage?.number, -1,
      this.workplan, [workplanId => {
        if (df) {
          df.close({});
        }
      }, this.bindUpdateWorkplan]);
  }

  private updateWorkplan(workplanId: string) {
    this._workplanId = workplanId;

    const vtree: {
      treeFile: TreeNode[],
      workPlan?: Workplan
    } = this.workplanManagement.getFileTree(this.go.getWorkplan(workplanId));

    this.fillFromTreeFile(vtree.treeFile, vtree?.workPlan);
  }

  public expandWorkTask(event: any) {
    this._nodeExpand = event?.node;
  }

  public collapseNode(event: any) {
    this._nodeExpand = undefined;
  }
}
