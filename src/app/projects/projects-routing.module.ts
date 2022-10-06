import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IsMissionGuard } from '../shared/guards/is-mission.guard';
import { DetailProjectComponent } from './detail-project/detail-project.component';
import { MyProjectsComponent } from './my-projects/my-projects.component';
import { ProjectsComponent } from './projects.component';
import { ReportProjectComponent } from './report-project/report-project.component';

const routes: Routes = [
  { path: '', component: ProjectsComponent },
  { path: 'mes-projets', component: MyProjectsComponent },
  { path: ':slug', component: DetailProjectComponent },
  { path: ':slug/:user/signaler', canActivate : [IsMissionGuard], component: ReportProjectComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
