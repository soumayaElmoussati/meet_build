import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportProjectComponent } from '../projects/report-project/report-project.component';
import { AboutComponent } from './about/about.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CreatedJobsComponent } from './created-jobs/created-jobs.component';
import { CreatedProjectsComponent } from './created-projects/created-projects.component';
import { RatesComponent } from './rates/rates.component';

const routes: Routes = [
  { path: '', component: AboutComponent },
  { path: 'projets', component: CreatedProjectsComponent },
  { path: 'agenda', component: CalendarComponent },
  { path: 'evaluations', component: RatesComponent },
  { path: 'jobs', component: CreatedJobsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
