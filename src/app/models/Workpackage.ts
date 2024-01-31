import {Task} from "./Task";
import {Period} from "./Period";

/**
 * Class regarding the work description.
 */
export interface Workpackage {
  number: number;
  description: string;
  tasks?: Task[];

  period?: Period;
}
