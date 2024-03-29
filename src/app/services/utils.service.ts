import {Inject, Injectable, LOCALE_ID} from "@angular/core";
import {LoggerService} from "./logger.service";
import {DatePipe} from "@angular/common";

/**
 * Service regarding utilities functionalities.
 */
@Injectable({
  providedIn: "root"
})
export class UtilsService {

  private _datePipe;

  constructor(private log: LoggerService,
              @Inject(LOCALE_ID) public locale: string
  ) {
    this._datePipe = new DatePipe(locale);
  }

  public getUniqueId(parts: number = 5): string {
    const stringArr = [];
    for (let i = 0; i < parts; i++) {
      // tslint:disable-next-line:no-bitwise
      const S4 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      stringArr.push(S4);
    }
    return stringArr.join("-");
  }

  public strToDate(value: string): Date {
    return new Date(value);
  }

  public formatDate(date?: Date, format: string = "short"): string {
    try {
      return (date ? this._datePipe.transform(date, format) : undefined) || "N/A";
    } catch (e) {
      this.log.error("The date is invalid. Date given = ", date);

      return "N/A";
    }
  }
}
