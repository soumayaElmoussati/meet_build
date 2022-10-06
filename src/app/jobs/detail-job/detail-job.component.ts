import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HelpersService } from 'src/app/shared/services/helpers.service';
import { environment } from 'src/environments/environment.prod';
import { JobService } from 'src/app/shared/services/job.service';
import { MatDialog } from '@angular/material/dialog';
import { JobDescriptionComponent } from '../edit-job/job-description/job-description.component';
import { JobDetailsComponent } from '../edit-job/job-details/job-details.component';
import { ConfirmationComponent } from 'src/app/shared/dialogs/confirmation/confirmation.component';
import { CouponCodeComponent } from 'src/app/shared/dialogs/coupon-code/coupon-code.component';
@Component({
  selector: 'app-detail-job',
  templateUrl: './detail-job.component.html',
  styleUrls: ['./detail-job.component.scss']
})
export class DetailJobComponent implements OnInit {

  jobSlug: string;
  job : any;
  profileImgUrl = environment.profileImgUrl;
  
  constructor(    
    private helpersS: HelpersService, 
    private route: ActivatedRoute,
    private jobS: JobService,
    private router: Router,
    private dialog: MatDialog) {
      this.route.paramMap.subscribe(params => {
        this.jobSlug = params.get('slug');
      });
     }

  ngOnInit(): void {
    this.getJob();
  }
  getJob(){
    this.jobS.getJobDetail(this.jobSlug).subscribe(
      data => { this.job = data.data }
    )
  }

  setRouter(path){
    this.router.navigateByUrl(path)
  }

  editDescription(){
    const dialog = this.dialog.open( JobDescriptionComponent , {
      data: this.job,
      width: '700px',
      height: 'auto',
      disableClose: true
    });

    dialog.afterClosed().subscribe(data => {
      if( data ){
        this.job.function = data.function;
        this.job.description = data.description;
        this.job.category = data.category;
        this.job.sous_category = data.sous_category;
      }
    })
  }

  editDetails(){
    const dialog = this.dialog.open( JobDetailsComponent , {
      data: this.job,
      width: '700px',
      height: 'auto',
      disableClose: true
    });

    dialog.afterClosed().subscribe(data => {
      if( data ){
        this.job.address = data.address;
        this.job.competences = data.competences;
        this.job.tel = data.tel;
        this.job.email_contact = data.email_contact;
        this.job.languages = data.languages;
        this.job.contract_type = data.contract_type;
      }
    })
  }

  onDeleteJob(){
    const dialog = this.dialog.open( ConfirmationComponent , {
      data : {
        title: 'ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_AD',
        content: "THIS_JOB_WILL_BE_PERMANENTLY_DELETED_ARE_YOU_SURE_YOU_WANT_TO_DELETE_IT",
        confirmBtn: 'DELETE_THIS_AD',
        cancelBtn: 'CANCEL' 
      },
      width: '500px',
      height: 'auto',
      disableClose: true
    });
    dialog.afterClosed().subscribe(result => {
      if(result && result.confirm){
          this.jobS.deleteJob( this.job.id ).subscribe(
            data => {this.router.navigateByUrl('/jobs/tous-jobs' );},
            error => {},
            () => {
            }
          )

      }
    })
  }
  extendAd(){
    const dialog = this.dialog.open( CouponCodeComponent , {
      data : {
        title: 'RENEW_YOUR_AD',
        content: "YOUR_AD_WILL_AGAIN_BE_VISIBLE",
        confirmBtn: 'PAY',
        cancelBtn: 'CANCEL' 
      },
      width: '500px',
      height: 'auto',
      disableClose: true
    });
    dialog.afterClosed().subscribe(result => {
      if(result && result.confirm){
        this.jobS.extendAd(this.job.id, result.data.codePromo ).subscribe(
          data => {
            if(data.payment_link){
              location.href = data.payment_link;
            }else{
              this.getJob();
            }
          }
        )
      }
    })
  }

}
