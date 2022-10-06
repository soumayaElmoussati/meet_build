import { ProfileHomeComponent } from './core/profile-home/profile-home.component';
import { RegisterComponent } from './auth/register/register.component';
import { SendRequestComponent } from './auth/reset-password/send-request/send-request.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password/reset-password.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { ProjectHomeComponent } from './core/project-home/project-home.component';
import { ReferenceDetailComponent } from './profile/reference-detail/reference-detail.component';
import { MyProfileHomeComponent } from './core/my-profile-home/my-profile-home.component';
import { MakeReviewComponent } from './me/my-rates/make-review/make-review.component';
import { NewProjectComponent } from './projects/new-project/new-project.component';
import { ServiceProvidersComponent } from './service-providers/service-providers.component';
import { NewJobComponent } from './jobs/new-job/new-job.component';
import { JobHomeComponent } from './core/job-home/job-home.component';
import { PostulationsHomeComponent } from './core/postulations-home/postulations-home.component';
import { ProjectConversationsHomeComponent } from './core/project-conversations-home/project-conversations-home.component';
import { MyCvHomeComponent } from './core/my-cv-home/my-cv-home.component';
import { DiscussHomeComponent } from './core/discuss-home/discuss-home.component';
import { IsNotLoginGuard } from './shared/guards/is-not-login.guard';
import { IsNotAdminGuard } from './shared/guards/is-not-admin.guard';
import { IsMissionGuard } from './shared/guards/is-mission.guard';
import { IsJobGuard } from './shared/guards/is-job.guard';
import { IsJobMissionGuard } from './shared/guards/is-job-mission.guard';
import { IsAdminGuard } from './shared/guards/is-admin.guard';
import { IsLoginGuard } from './shared/guards/is-login.guard';
import { SubscriptionComponent } from './website/subscription/subscription.component';
import { HomeComponent } from './website/home/home.component';
import { HelpComponent } from './website/help/help.component';
import { PressComponent } from './website/press/press.component';
import { TermsOfServiceComponent } from './website/terms-of-service/terms-of-service.component';
import { OurHistoryComponent } from './website/our-history/our-history.component';
import { PrivacyPolicyComponent } from './website/privacy-policy/privacy-policy.component';
import { AdminCoreComponent } from './admin/admin-core/admin-core.component';
import { ReportProfileComponent } from './profile/report-pofile/report-profile.component';
import { PostesComponent } from './discuss/postes/postes.component';
import { TestComponent } from './test/test.component';
import { PageNotFountComponent } from './page-not-fount/page-not-fount.component';

import { IndexComponent } from './post/index/index.component';
import { ViewComponent } from './post/view/view.component';
import { CreateComponent } from './post/create/create.component';
import { EditComponent } from './post/edit/edit.component';

const routes: Routes = [

  {path: '', component: HomeComponent}, 
  {path: 'page-introuvable', component: PageNotFountComponent}, 

  {path: 'postes', component: PostesComponent},

  //{ path: '',redirectTo: '/', pathMatch: 'full' },
  { path: 'abonnement', component: SubscriptionComponent },
  { path: 'assistance', component: HelpComponent },
  { path: 'presse', component: PressComponent },
  { path: 'conditions-generales-d-utilisation', component: TermsOfServiceComponent },
  { path: 'politique-de-confidentialite', component: PrivacyPolicyComponent },
  { path: 'notre-histoire', component: OurHistoryComponent },

  { path: 'register', component: RegisterComponent },
  { path: 'register/job', component: RegisterComponent },
  { path: 'register/:id', component: RegisterComponent },
  { path: 'login', canActivate : [IsNotLoginGuard], component: LoginComponent},
  { path: 'send-request', component: SendRequestComponent },
  { path: 'reset-password/:id', component: ResetPasswordComponent },
  { path: 'prestataires', component: ServiceProvidersComponent },
  { path: 'evaluation/:id/:request_id', component: MakeReviewComponent },
  { path: 'projet/creer', canActivate : [IsMissionGuard], component: NewProjectComponent},
  { path: 'job/creer', canActivate : [IsJobMissionGuard], component: NewJobComponent},
  { path: 'job/creer/:subscription_id/:slug/:job_id', component: NewJobComponent},
  {
    path: 'projet-conversations/:id' , component: ProjectConversationsHomeComponent, children: [
      { path: '', loadChildren: () => import('./project-conversations/project-conversations.module').then(m => m.ProjectConversationsModule) },
    ]
  },
  {
    path: 'mes-postulations', canActivate : [IsNotAdminGuard] , component: PostulationsHomeComponent, children: [
      { path: '', loadChildren: () => import('./postulations/postulations.module').then(m => m.PostulationsModule) },
    ]
  },
  {
    path: 'discuss', canActivate : [IsLoginGuard, IsNotAdminGuard] , component: DiscussHomeComponent, 
    children: [
      {
        path: '', loadChildren: () => import('./discuss/discuss.module').then(m => m.DiscussModule) 
     },
    ]
  },
  {
    path: 'projets', canActivate : [IsNotAdminGuard], component: ProjectHomeComponent, children: [
      { path: '', loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule) },
    ]
  },
  {
    path: 'jobs', canActivate : [IsNotAdminGuard] , component: JobHomeComponent, children: [
      { path: '', loadChildren: () => import('./jobs/jobs.module').then(m => m.JobsModule) },
    ]
  },
  {
    path: 'jobs/', canActivate : [IsNotAdminGuard], component: JobHomeComponent, children: [
      { path: 'list/tous-jobs', loadChildren: () => import('./jobs/jobs.module').then(m => m.JobsModule) },
    ]
  },
  {
    path: 'cv', canActivate : [IsNotAdminGuard] , component: MyCvHomeComponent, children: [
      { path: '', loadChildren: () => import('./my-cv/my-cv.module').then(m => m.MyCvModule) },
    ]
  }, 
  {
    path: 'admin', canActivate : [IsLoginGuard ,IsAdminGuard], component: AdminCoreComponent, children: [
      { path: '', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
    ]
  }, 

  { path: ':profile/reference/:id', component: ReferenceDetailComponent },
  
  {
    path: 'me', canActivate : [IsJobMissionGuard], component: MyProfileHomeComponent, children: [
      { path: '', loadChildren: () => import('./me/me.module').then(m => m.MeModule) },
    ]
  },

  { path: ':profile/:user/signaler', canActivate : [IsMissionGuard], component: ProjectHomeComponent, children: [
    { path: '', component: ReportProfileComponent }
  ] },
  {
    path: ':profile', component: ProfileHomeComponent, children: [
      { path: '', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule) },
    ]
  },
  { path: 'post', redirectTo: 'post/index', pathMatch: 'full'},
  { path: 'post/index', component: IndexComponent },
  { path: 'post/:postId/view', component: ViewComponent },
  { path: 'post/create', component: CreateComponent },
  { path: 'post/:postId/edit', component: EditComponent } 
  //{ path: '**', component:PageNotFountComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
