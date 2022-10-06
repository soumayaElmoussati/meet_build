import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectConversationsComponent } from './project-conversations.component';

const routes: Routes = [
  { path: '', component: ProjectConversationsComponent },
  { path: ':conversation', component: ProjectConversationsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectConversationsRoutingModule { }
