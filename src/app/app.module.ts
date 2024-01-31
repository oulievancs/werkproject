import {NgModule} from "@angular/core";
import {BrowserModule, provideClientHydration} from "@angular/platform-browser";

import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {WorkplanManagementComponent} from "./components/workplan-management/workplan-management.component";
import {InputTextModule} from "primeng/inputtext";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {WorkpackgesListComponent} from "./components/workpackges-list/workpackges-list.component";
import {TreeModule} from "primeng/tree";
import {WorkpackageManagementComponent} from "./components/workpackage-management/workpackage-management.component";
import {ToolbarModule} from "primeng/toolbar";
import {ToastModule} from "primeng/toast";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {DynamicDialogModule} from "primeng/dynamicdialog";
import {TreeTableModule} from "primeng/treetable";
import {MultiSelectModule} from "primeng/multiselect";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {CommonModule, DatePipe} from "@angular/common";
import {TaskManagementComponent} from "./components/task-management/task-management.component";
import {CalendarModule} from "primeng/calendar";
import {RippleModule} from "primeng/ripple";
import {SplitterModule} from "primeng/splitter";
import {ConfirmPopupModule} from "primeng/confirmpopup";
import {AnimateModule} from "primeng/animate";
import {DividerModule} from "primeng/divider";
import {HttpClientModule} from "@angular/common/http";
import {MessagesModule} from "primeng/messages";
import {ConfirmationService, MessageService} from "primeng/api";

@NgModule({
  declarations: [
    AppComponent,
    WorkplanManagementComponent,
    WorkpackgesListComponent,
    WorkpackageManagementComponent,
    TaskManagementComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    TreeModule,
    ToolbarModule,
    ToastModule,
    ConfirmDialogModule,
    DynamicDialogModule,
    TreeTableModule,
    MultiSelectModule,
    FormsModule,
    BrowserAnimationsModule,
    CalendarModule,
    RippleModule,
    SplitterModule,
    ConfirmPopupModule,
    AnimateModule,
    DividerModule,
    HttpClientModule,
  ],
  providers: [
    provideClientHydration(),
    DatePipe,
    ConfirmationService,
    MessageService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
