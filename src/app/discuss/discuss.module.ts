import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { PostesComponent } from './postes/postes.component';
import { AddPosteComponent } from './add-poste/add-poste.component';
import { RouterModule, Routes } from '@angular/router';
import { DiscussSubscriptionsComponent } from './discuss-subscriptions/discuss-subscriptions.component';
import { DiscussSubscribersComponent } from './discuss-subscribers/discuss-subscribers.component';
import { ReportPosteComponent } from './report-poste/report-poste.component';
import { DiscussNotificationsComponent } from './discuss-notifications/discuss-notifications.component';

const routes: Routes = [
  {path: '', component: PostesComponent},
  {path: 'signaler/poste/:id/:user', component: ReportPosteComponent },
  {path: 'postes', component: PostesComponent},
  {path: 'poste/:id', component: PostesComponent},
  {path: 'mes-abonnements', component: DiscussSubscriptionsComponent},
  {path: 'mes-abonnes', component: DiscussSubscribersComponent},
];

@NgModule({
  declarations: [AddPosteComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DiscussModule { }
