# Workproject

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.9.

In this project a *Workplan* application management created, in order
to help an application industry to collaborate software engineers and
all staff, in order to develop a high quality software.

Presentation:

* A first component regarding the initial state of a project,
where a name regarding the *workplan* given.

* A component, regarding the main dashboard of the application,
and presents into an awesome acordeon list, all the *workpackages*
of the *workplan* and the dependent *tasks*. Furthermore, calculated
dates are viewed on this section, on each *workpackage* regarding
the periods of *tasks* referenced to each *workpackage*,
and shows the date of the earliest *task* and the date of the latest
*task*.

* A component regarding the *workpackage* management. Only,
name of the *workpackage* is allowed to be edited.

* Finally, a component regarding the management of each *task*
where name, and *time periods* can be edited.

Also, application communicates with a concurent server, with a
*Neo4J* connection, where the workplan is persisted, and could be
fetched, on the first page, by giving the uuid of *workplan*.

Moreover, more information about the backend you can visit
the repository [Repo](https://github.com/oulievancs/social-albums/blob/main/api/workProjectBackend.py).



## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
