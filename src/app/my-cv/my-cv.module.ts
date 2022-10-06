import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyCvRoutingModule } from './my-cv-routing.module';
import { SubmitCvComponent } from './submit-cv/submit-cv.component';
import { SharedModule } from '../shared/shared.module';
import { ConfirmationEmailComponent } from './confirmation-email/confirmation-email.component';


@NgModule({
  declarations: [SubmitCvComponent, ConfirmationEmailComponent],
  imports: [
    CommonModule,
    MyCvRoutingModule,
    SharedModule
  ]
})
export class MyCvModule { }
