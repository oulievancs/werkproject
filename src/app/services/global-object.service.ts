import {Injectable} from "@angular/core";
import {Workplan} from "../models/Workplan";
import {Period} from "../models/Period";
import {Workpackage} from "../models/Workpackage";
import {UtilsService} from "./utils.service";
import {LoggerService} from "./logger.service";
import {Task} from "../models/Task";

@Injectable({
  providedIn: "root"
})
export class GlobalObjectService {

  private static WORKPLANS_KEY_STORAGE = "workplans";

  private _globalWorkplans: any = {};

  constructor(private utils: UtilsService,
              private log: LoggerService) {
    this._globalWorkplans = JSON.parse(String(localStorage.getItem(GlobalObjectService.WORKPLANS_KEY_STORAGE))) || {};
  }

  public initWorkplan(value: Workplan): string {
    return this.saveWorkplan(undefined, value);
  }

  public updateWorkplan(uuid: string, value: Workplan) {
    return this.saveWorkplan(uuid, value);
  }

  private saveWorkplan(uuid: string | undefined, value: Workplan): string {
    const vuuid: string = uuid || this.utils.getUniqueId();

    const el: { key: string, workplan: Workplan } = {
      key: vuuid, workplan: {
        ...value,
        getPeriod: (workplan: Workplan) => {
          return {
            start: new Date(this.getDatetime(
              datetimes => Math.min.apply(null, datetimes), p => p.start,
              workplan?.workpackages)),
            end: new Date(this.getDatetime(
              datetimes => Math.max.apply(null, datetimes), p => p.end,
              workplan?.workpackages))
          };
        }
      }
    };

    if (el.workplan.workpackages) {
      el.workplan.workpackages.forEach(wp => {
        wp.period = {
          start: new Date(this.getDatetimeWorkpackage(
            datetimes => Math.min.apply(null, datetimes), p => p.start,
            wp?.tasks)),
          end: new Date(this.getDatetimeWorkpackage(
            datetimes => Math.max.apply(null, datetimes), p => p.end,
            wp?.tasks))
        };
      });
    }

    this.log.log(el);

    this.pushElement(el);

    return vuuid;
  }

  public findWorkpackage(uuid: string, workpachageId: number): Workpackage | undefined {
    return this.getWorkplan(uuid)?.workpackages
      ?.find(w => w.number === workpachageId);
  }

  public findTask(uuid: string, workpachageId: number, taskId: number): Task | undefined {
    return this.findWorkpackage(uuid, workpachageId)
      ?.tasks?.find(t => t.number === taskId);
  }

  public getWorkplan(uuid: string): Workplan | undefined {
    return this._globalWorkplans[uuid];
  }

  private pushElement(el: { key: string, workplan: Workplan }) {
    this._globalWorkplans[el.key] = el.workplan;

    localStorage.setItem(GlobalObjectService.WORKPLANS_KEY_STORAGE, JSON.stringify(this._globalWorkplans));
  }

  private getDatetime(fn: (datetimes: number[]) => number, getter: (p: Period) => Date, workpackeges?: Workpackage[],): number {
    return fn(workpackeges?.flatMap(w => {
      return (w.tasks || []).flatMap(t => {
        return (t.periods || []).map(p => {
          const dt: Date = getter(p);
          return dt ? dt.getTime() : 0;
        });
      });
    }) || []);
  }

  private getDatetimeWorkpackage(fn: (datetimes: number[]) => number, getter: (p: Period) => Date, tasks?: Task[],): number {
    return fn(tasks?.flatMap(t => {
      return (t.periods || []).map(p => {
        const dt: Date = getter(p);
        return dt ? dt.getTime() : 0;
      });
    }) || []);
  }

  private getRandomDate(): Period {
    const start = new Date(+(new Date()) - Math.floor(Math.random() * 10000000000));
    const end = new Date(+(new Date()) - Math.floor(Math.random() * 10000000000));
    // start.setTime(start.getTime() + Math.floor(60 * 60 * 60 * 24));
    // end.setTime(end.getTime() + Math.floor(60 * 60 * 60 * 24) + 1);
    return {start, end};
  }

  private generateRandomTask(number: number): Task {
    return {
      number,
      description: `Task ${number}`,
      periods: Array.from({length: Math.floor(4)}).map(_ => this.getRandomDate()),
    };
  }

  private generateRandomWorkPackage(number: number): Workpackage {
    const tasks: Task[] = Array.from({length: Math.floor(Math.random() * 25 + 1)}, (_, index) =>
      this.generateRandomTask(index + 1)
    );

    return {
      number,
      description: `Workplan ${number}`,
      tasks,
    };
  }

  public generateRandomWorkPackages(size: number = 25): Workpackage[] {
    return Array.from({length: Math.floor(Math.random() * 25)}, (_, index) =>
      this.generateRandomWorkPackage(index + 1)
    )
  }
}
