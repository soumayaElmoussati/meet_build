import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EducationsComponent } from './educations/educations.component';
import { FavoriteProfileComponent } from './favorite-profile/favorite-profile.component';
import { MeComponent } from './me/me.component';
import { MyCalendarComponent } from './my-calendar/my-calendar.component';
import { MyInvoicesComponent } from './my-invoices/my-invoices.component';
import { MyRatesComponent } from './my-rates/my-rates.component';
import { MySubscriptionComponent } from './my-subscription/my-subscription.component';

const routes: Routes = [
  { path: '', component: MeComponent },
  { path: 'profile-favoris', component: FavoriteProfileComponent },
  { path: 'evaluations', component: MyRatesComponent },
  { path: 'abonnement', component: MySubscriptionComponent },
  { path: 'formation', component: EducationsComponent },
  { path: 'factures', component: MyInvoicesComponent },
  { path: 'agenda', component: MyCalendarComponent },
  { path: ':subscriptionId', component: MeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeRoutingModule { }
