import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailJobComponent } from './detail-job/detail-job.component';
import { JobsComponent } from './jobs.component';
import { AllJobsComponent } from './all-jobs/all-jobs.component';
import { ApplyForJobComponent } from './apply-for-job/apply-for-job.component';
import { ReportJobComponent } from './report-job/report-job.component';
import { IsMissionGuard } from '../shared/guards/is-mission.guard';

const routes: Routes = [
  { path: '', component: JobsComponent },
  // { path: 'all', component:  AllJobsComponent},
  { path: 'list/:mine', component:  AllJobsComponent},
  { path: ':slug', component: DetailJobComponent },
  { path: ':slug/postuler', component: ApplyForJobComponent },
  { path: ':slug/:user/signaler', canActivate : [IsMissionGuard], component: ReportJobComponent },
  //{ path: 'job/postuler/:jobId', component: ApplyForJobComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobsRoutingModule { }
