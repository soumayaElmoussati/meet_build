import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminInvoicesComponent } from './admin-invoices/admin-invoices.component';
import { AdminReportDetailComponent } from './admin-report-detail/admin-report-detail.component';
import { AdminReportComponent } from './admin-report/admin-report.component';
import { AdminComponent } from './admin.component';
import { CodePromoComponent } from './code-promo/code-promo.component';
import { ModerationCategoriesComponent } from './moderation-categories/moderation-categories.component';
import { ModerationCodeNaceAssignmentComponent } from './moderation-code-nace-assignment/moderation-code-nace-assignment.component';
import { ModerationCodeNaceComponent } from './moderation-code-nace/moderation-code-nace.component';
import { ModerationUsersComponent } from './moderation-users/moderation-users.component';
import { SendAlertComponent } from './send-alert/send-alert.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  { path: '', component: AdminComponent },
  { path: 'utilisateurs', component: UsersComponent },
  { path: 'envoyer-une-alerte/:email', component: SendAlertComponent },
  { path: 'signalements/:type', component: AdminReportComponent },
  { path: 'signalements/:type/:id', component: AdminReportDetailComponent },
  { path: 'facturation', component: AdminInvoicesComponent },
  { path: 'moderation/utilisateurs', component: ModerationUsersComponent },
  { path: 'moderation/categories', component: ModerationCategoriesComponent },
  { path: 'moderation/code-nace', component: ModerationCodeNaceComponent },
  { path: 'moderation/code-nace/affectation/:id/:description', component: ModerationCodeNaceAssignmentComponent },
  { path: 'code-promo', component: CodePromoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
