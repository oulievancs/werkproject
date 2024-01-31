import {Workpackage} from "./Workpackage";
import {Period} from "./Period";

/**
 * Class regarding the project description.
 */
export interface Workplan {
  title: string;
  workpackages?: Workpackage[];

  getPeriod?: (workplan: Workplan) => Period;
}
