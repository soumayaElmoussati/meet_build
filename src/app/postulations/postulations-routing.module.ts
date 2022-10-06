import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostulationsHomeComponent } from '../core/postulations-home/postulations-home.component';
import { MessagesComponent } from './messages/messages.component';
import { PostulationsComponent } from './postulations.component';

const routes: Routes = [
  { path: ':state', component: PostulationsComponent },
  { path: ':state/:id', component: MessagesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostulationsRoutingModule { }
