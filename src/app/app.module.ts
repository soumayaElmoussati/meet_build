import { TokenInterceptorService } from './shared/services/token-interceptor.service';
import { ErrorInterceptor } from './shared/services/error.interceptor';
import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginComponent } from './auth/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../app/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ResetPasswordComponent } from './auth/reset-password/reset-password/reset-password.component';
import { SendRequestComponent } from './auth/reset-password/send-request/send-request.component';
import { RegisterComponent } from './auth/register/register.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { CoreComponent } from './core/core.component';
import { NavComponent } from './core/nav/nav.component';
import { FooterComponent } from './core/footer/footer.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectHomeComponent } from './core/project-home/project-home.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileHomeComponent } from './core/profile-home/profile-home.component';
import { AboutComponent } from './profile/about/about.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FlexLayoutServerModule } from '@angular/flex-layout/server';
import { CalendarComponent } from './profile/calendar/calendar.component';
import { RatesComponent } from './profile/rates/rates.component';
import { CreatedProjectsComponent } from './profile/created-projects/created-projects.component';
import { ReferenceDetailComponent } from './profile/reference-detail/reference-detail.component';
import { DatePipe } from '@angular/common';
import { ProfileMenuComponent } from './core/menus/profile-menu/profile-menu.component';
import { MyProfileMenuComponent } from './core/menus/my-profile-menu/my-profile-menu.component';
import { MeComponent } from './me/me/me.component';
import { MyProfileHomeComponent } from './core/my-profile-home/my-profile-home.component';
import { AddReferenceComponent } from './me/add-reference/add-reference.component';
import { ConfirmationComponent } from './shared/dialogs/confirmation/confirmation.component';
import { FavoriteProfileComponent } from './me/favorite-profile/favorite-profile.component';
import { EducationsComponent } from './me/educations/educations.component';
import { MyCalendarComponent } from './me/my-calendar/my-calendar.component';
import { MyRatesComponent } from './me/my-rates/my-rates.component';
import { SendInvitationComponent } from './me/my-rates/send-invitation/send-invitation.component';
import { MakeReviewComponent } from './me/my-rates/make-review/make-review.component';
import { MySubscriptionComponent } from './me/my-subscription/my-subscription.component';
import { MyInvoicesComponent } from './me/my-invoices/my-invoices.component';
import { NewProjectComponent } from './projects/new-project/new-project.component';
import { ServiceProvidersComponent } from './service-providers/service-providers.component';
import { ProviderComponent } from './service-providers/provider/provider.component';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { JobsComponent } from './jobs/jobs.component';
import { NewJobComponent } from './jobs/new-job/new-job.component';
import { ProjectDescriptionComponent } from './projects/edit-project/project-description/project-description.component';
import { ProjectFilesComponent } from './projects/edit-project/project-files/project-files.component';
import { ProjectDetailsComponent } from './projects/edit-project/project-details/project-details.component';
import { AllJobsComponent } from './jobs/all-jobs/all-jobs.component';
import { JobHomeComponent } from './core/job-home/job-home.component';
import { RateProjectComponent } from './projects/rate-project/rate-project.component';
import { MyProjectsComponent } from './projects/my-projects/my-projects.component';
import { MyProjectsPostulationsComponent } from './core/headers/my-projects-postulations/my-projects-postulations.component';
import { PostulationsHomeComponent } from './core/postulations-home/postulations-home.component';
import { PostulationsComponent } from './postulations/postulations.component';
import { ListComponent } from './postulations/list/list.component';
import { MessagesComponent } from './postulations/messages/messages.component';
import { JobDescriptionComponent } from './jobs/edit-job/job-description/job-description.component';
import { JobDetailsComponent } from './jobs/edit-job/job-details/job-details.component';
import { ProjectConversationsHomeComponent } from './core/project-conversations-home/project-conversations-home.component';
import { ProjectConversationsComponent } from './project-conversations/project-conversations.component';
import { AssignModelComponent } from './project-conversations/assign-model/assign-model.component';
import { ApplyForJobComponent } from './jobs/apply-for-job/apply-for-job.component';
import { MyCvHomeComponent } from './core/my-cv-home/my-cv-home.component';
import { MyCvComponent } from './my-cv/my-cv.component';
import { DiscussHomeComponent } from './core/discuss-home/discuss-home.component';
import { PosteComponent } from './shared/components/discuss/poste/poste.component';
import { RightMenuComponent } from './core/menus/right-menu/right-menu.component';
import { JobNavComponent } from './core/nav/job-nav/job-nav.component';
import { MissionNavComponent } from './core/nav/mission-nav/mission-nav.component';
import { HomeComponent } from './website/home/home.component';
import { PlansComponent } from './website/components/plans/plans.component';
import { EvolutionComponent } from './website/components/evolution/evolution.component';
import { LinksComponent } from './website/components/links/links.component';
import { SubscriptionComponent } from './website/subscription/subscription.component';
import { NavigationComponent } from './website/navigation/navigation.component';
import { HelpComponent } from './website/help/help.component';
import { PressComponent } from './website/press/press.component';
import { TermsOfServiceComponent } from './website/terms-of-service/terms-of-service.component';
import { OurHistoryComponent } from './website/our-history/our-history.component';
import { PrivacyPolicyComponent } from './website/privacy-policy/privacy-policy.component';
import { AdminComponent } from './admin/admin.component';
import { AdminCoreComponent } from './admin/admin-core/admin-core.component';
import { UsersComponent } from './admin/users/users.component';
import { SendAlertComponent } from './admin/send-alert/send-alert.component';
import { QuillModule } from 'ngx-quill';
import { ReportProfileComponent } from './profile/report-pofile/report-profile.component';
import { ReportJobComponent } from './jobs/report-job/report-job.component';
import { AdminReportComponent } from './admin/admin-report/admin-report.component';
import { AdminReportDetailComponent } from './admin/admin-report-detail/admin-report-detail.component';
import { AdminInvoicesComponent } from './admin/admin-invoices/admin-invoices.component';
import { DiscussSubscriptionsComponent } from './discuss/discuss-subscriptions/discuss-subscriptions.component';
import { DiscussSubscribersComponent } from './discuss/discuss-subscribers/discuss-subscribers.component';
import { PostesComponent } from './discuss/postes/postes.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ReportPosteComponent } from './discuss/report-poste/report-poste.component';
import { DiscussNotificationsComponent } from './discuss/discuss-notifications/discuss-notifications.component';
import { ChartsModule } from 'ng2-charts';
import { ModerationUsersComponent } from './admin/moderation-users/moderation-users.component';
import { ModerationCategoriesComponent } from './admin/moderation-categories/moderation-categories.component';
import { CouponCodeComponent } from './shared/dialogs/coupon-code/coupon-code.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NotConnectedNavComponent } from './core/nav/not-connected-nav/not-connected-nav.component';
import { CouponPromoComponent } from './website/modals/coupon-promo/coupon-promo.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { SuggestionsListComponent } from './discuss/suggestions-list/suggestions-list.component';
import { TestComponent } from './test/test.component';
import { HelpButtonComponent } from './website/components/help-button/help-button.component';
import { AddNewCategoryComponent } from './admin/moderation-categories/add-new-category/add-new-category.component';
import { CodePromoComponent } from './admin/code-promo/code-promo.component';
import { UniversalStorage } from './shared/storage/universal.storage';
import { CookieService, CookieModule } from '@gorniv/ngx-universal';
import { ModerationCodeNaceComponent } from './admin/moderation-code-nace/moderation-code-nace.component';
import { ModerationCodeNaceAssignmentComponent } from './admin/moderation-code-nace-assignment/moderation-code-nace-assignment.component';
import { PageNotFountComponent } from './page-not-fount/page-not-fount.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ResetPasswordComponent,
    SendRequestComponent,
    RegisterComponent,
    CoreComponent,
    NavComponent,
    FooterComponent,
    ProjectsComponent,
    ProjectHomeComponent,
    ProfileComponent,
    ProfileHomeComponent,
    AboutComponent,
    CalendarComponent,
    RatesComponent,
    CreatedProjectsComponent,
    ReferenceDetailComponent,
    ProfileMenuComponent,
    MyProfileMenuComponent,
    MeComponent,
    MyProfileHomeComponent,
    AddReferenceComponent,
    ConfirmationComponent,
    FavoriteProfileComponent,
    EducationsComponent,
    MyCalendarComponent,
    MyRatesComponent,
    SendInvitationComponent,
    MakeReviewComponent,
    MySubscriptionComponent,
    MyInvoicesComponent,
    NewProjectComponent,
    ServiceProvidersComponent,
    ProviderComponent,
    JobsComponent,
    NewJobComponent,
    ProjectDescriptionComponent,
    ProjectFilesComponent,
    ProjectDetailsComponent,
    AllJobsComponent,
    JobHomeComponent,
    RateProjectComponent,
    MyProjectsComponent,
    MyProjectsPostulationsComponent,
    PostulationsHomeComponent,
    PostulationsComponent,
    ListComponent,
    MessagesComponent,
    JobDescriptionComponent,
    JobDetailsComponent,
    ProjectConversationsHomeComponent,
    ProjectConversationsComponent,
    AssignModelComponent,
    ApplyForJobComponent,
    MyCvHomeComponent,
    MyCvComponent,
    DiscussHomeComponent,
    RightMenuComponent,
    JobNavComponent,
    MissionNavComponent,
    HomeComponent,
    PlansComponent,
    EvolutionComponent,
    LinksComponent,
    SubscriptionComponent,
    NavigationComponent,
    HelpComponent,
    PressComponent,
    TermsOfServiceComponent,
    OurHistoryComponent,
    PrivacyPolicyComponent,
    AdminComponent,
    AdminCoreComponent,
    UsersComponent,
    SendAlertComponent,
    ReportProfileComponent,
    ReportJobComponent,
    AdminReportComponent,
    AdminReportDetailComponent,
    AdminInvoicesComponent,
    DiscussSubscriptionsComponent,
    DiscussSubscribersComponent,
    PostesComponent,
    DiscussNotificationsComponent,
    ReportPosteComponent,
    ModerationUsersComponent,
    ModerationCategoriesComponent,
    CouponCodeComponent,
    NotConnectedNavComponent,
    CouponPromoComponent,
    SuggestionsListComponent,
    TestComponent,
    HelpButtonComponent,
    AddNewCategoryComponent,
    CodePromoComponent,
    ModerationCodeNaceComponent,
    ModerationCodeNaceAssignmentComponent,
    PageNotFountComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
    NgbModule,
    MatToolbarModule,
    ReactiveFormsModule, 
    FormsModule,
    MatOptionModule,
    MatInputModule,
    MatSelectModule,
    AgmCoreModule.forRoot({ // @agm/core
      apiKey: 'AIzaSyDcFRKP7AWpsC5saNKrqsYsOLmWx_b_Vrw',
      libraries: ['places']
    }),
    AgmDirectionModule,
    FlexLayoutModule,
    QuillModule.forRoot(),
    InfiniteScrollModule,
    ChartsModule,
    NgxMatSelectSearchModule,
    MatSnackBarModule,
    CookieModule.forRoot()
  ],
  providers: [
    CookieService,
    UniversalStorage,
    {provide: MAT_DATE_LOCALE, useValue: 'fr-FR'},
    {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    /*
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }*/
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
