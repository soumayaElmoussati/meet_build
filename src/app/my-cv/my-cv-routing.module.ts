import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IsLoginGuard } from '../shared/guards/is-login.guard';
import { MyCvComponent } from './my-cv.component';
import { SubmitCvComponent } from './submit-cv/submit-cv.component';

const routes: Routes = [
  { path: '', component: SubmitCvComponent },
  { path: 'list', canActivate: [IsLoginGuard], component:  MyCvComponent},
  { path: ':action', component:  SubmitCvComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyCvRoutingModule { }
