import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslocoRootModule } from '../transloco/transloco-root.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RateComponent } from './components/rate/rate.component';
import { MatTableModule} from '@angular/material/table';
import { ProjectComponent } from './components/project/project.component';
import { JobComponent } from './components/job/job.component';
import { ConversationComponent } from './components/conversation/conversation.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule} from '@angular/material/slide-toggle';
import { PosteComponent } from './components/discuss/poste/poste.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NotConnectedComponent } from './dialogs/not-connected/not-connected.component'; 
import { MatRadioModule } from '@angular/material/radio';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SendMessageComponent } from './dialogs/send-message/send-message.component';

@NgModule({
  declarations: [RateComponent, ProjectComponent, JobComponent, ConversationComponent, NotConnectedComponent, PosteComponent, SendMessageComponent],
  imports: [
    CommonModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatCheckboxModule,
    TranslocoRootModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatMenuModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatToolbarModule,
    MatRadioModule,
    CarouselModule
  ],
  exports: [
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatCheckboxModule,
    TranslocoRootModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatAutocompleteModule,
    RateComponent,
    ProjectComponent,
    JobComponent,
    ConversationComponent,
    MatTableModule,
    MatMenuModule,
    MatSelectModule,
    MatSlideToggleModule,
    PosteComponent,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatToolbarModule,
    MatRadioModule,
    CarouselModule
  ]
})
export class SharedModule { }
