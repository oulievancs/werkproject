import {Period} from "./Period";

/**
 * Class regarding the task description.
 */
export interface Task {
  number: number;
  description: string;
  periods: Period[];
}
