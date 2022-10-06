import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobsRoutingModule } from './jobs-routing.module';
import { DetailJobComponent } from './detail-job/detail-job.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [DetailJobComponent],
  imports: [
    CommonModule,
    JobsRoutingModule,
    SharedModule
  ]
})
export class JobsModule { }
