import {Injectable} from "@angular/core";

/**
 * Service regarding the logging configuration.
 */
@Injectable({
  providedIn: "root"
})
export class LoggerService {

  constructor() {
  }

  public log(...data: any) {
    console.log(data);
  }

  public error(...data: any) {
    console.error(data);
  }
}
