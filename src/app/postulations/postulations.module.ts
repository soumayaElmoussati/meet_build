import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostulationsRoutingModule } from './postulations-routing.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PostulationsRoutingModule,
    SharedModule
  ]
})
export class PostulationsModule { }
