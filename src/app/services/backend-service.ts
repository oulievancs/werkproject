import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Workplan} from "../models/Workplan";
import {catchError, map, Observable} from "rxjs";
import {MessageService} from "primeng/api";

/**
 * Service regarding the communication with the backend.
 */
@Injectable({
  providedIn: "root"
})
export class BackendService {

  private SERVER: string = `http://127.0.0.1:8004/`;

  private SERVER_SEND_WORKPLAN = `${this.SERVER}insert_workplan`;

  private SERVER_GET_WORKPLAN = `${this.SERVER}get_workplan`;

  constructor(private httpClient: HttpClient,
              private messageService: MessageService) {
  }

  private intiHeasers(): HttpHeaders {
    const headers = new HttpHeaders();
    headers.set("Content-Type", "application/json; charset=utf-8")

    return headers;
  }

  public sendWorkplan(workplan: Workplan) {
    this.infoMessage("Request Sending...");

    return this.httpClient.post(this.SERVER_SEND_WORKPLAN, workplan, {headers: this.intiHeasers()})
      .pipe(map(resp => {
          this.infoMessage("Request successfully sent!");

          return resp;
        }),
        catchError(error => {
          this.errorMessage(error.error);

          throw error;
        })
      );
  }

  public getWorkplan(workplanId: string): Observable<Workplan> {
    this.infoMessage("Request Sending...");

    return this.httpClient.get(`${this.SERVER_GET_WORKPLAN}/${workplanId}`, {headers: this.intiHeasers()})
      .pipe(map(resp => {
          this.infoMessage("Request successfully sent!");

          return resp as Workplan;
        }),
        catchError(error => {
          this.errorMessage(error.error);

          throw error;
        })
      );
  }

  private infoMessage(message: string) {
    this.messageService.add({
      severity: "info",
      summary: "Confirmed",
      detail: message,
      life: 3000
    });
  }

  private errorMessage(message: string) {
    this.messageService.add({
      severity: "info",
      summary: "Confirmed",
      detail: "You have accepted",
      life: 3000
    });
  }
}
