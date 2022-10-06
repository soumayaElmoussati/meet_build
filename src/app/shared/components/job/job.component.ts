import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HelpersService } from '../../services/helpers.service';
import { ProjectService } from '../../services/project.service';
import { JobService } from 'src/app/shared/services/job.service';
import { ConfirmationComponent } from 'src/app/shared/dialogs/confirmation/confirmation.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss']
})
export class JobComponent implements OnInit {

  @Input() job;
  @Input() display = true;
  @Input() mine;
  @Input() showPicture;
  
  profileImgUrl = environment.profileImgUrl;

  constructor(
    private helpersS: HelpersService,
    private projectS: ProjectService,
    private jobS: JobService,
    private dialog: MatDialog,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  onDeleteJob(){
    const dialog = this.dialog.open( ConfirmationComponent , {
      data : {
        title: 'Etes-vous sûr(e) de vouloir supprimer cette annonce?',
        content: "Ce job sera supprimé définitivement. Êtes-vous sûr de vouloir la supprimer?",
        confirmBtn: 'SUPPRIMER CETTE ANNONCE',
        cancelBtn: 'CANCEL' 
      },
      width: '400px',
      height: 'auto',
      disableClose: true
    });
    dialog.afterClosed().subscribe(result => {
      if(result && result.confirm){
          this.jobS.deleteJob( this.job.id ).subscribe(
            data => {this.router.navigateByUrl('/jobs/list/tous-jobs' );},
            error => {},
            () => {
            }
          )

      }
    })
  }

}
