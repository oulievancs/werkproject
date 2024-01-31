import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {WorkplanManagementComponent} from "./components/workplan-management/workplan-management.component";
import {WorkpackgesListComponent} from "./components/workpackges-list/workpackges-list.component";

const routes: Routes = [
  // Define a default route
  {
    path: "", redirectTo: "/workplan", pathMatch: "full",
  },
  {
    path: "workplan", component: WorkplanManagementComponent,
  },
  {
    path: "workpackages-list", component: WorkpackgesListComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
