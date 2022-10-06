import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { SharedModule } from '../shared/shared.module';
import { DetailProjectComponent } from './detail-project/detail-project.component';
import { ReportProjectComponent } from './report-project/report-project.component';


@NgModule({
  declarations: [DetailProjectComponent, ReportProjectComponent],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    SharedModule
  ]
})
export class ProjectsModule { }
