import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { ProjectService } from 'src/app/shared/services/project.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-report-profile',
  templateUrl: './report-profile.component.html',
  styleUrls: ['./report-profile.component.scss']
})
export class ReportProfileComponent implements OnInit {

  projectSlug;
  reportReasonsList = null;
  showSuccessMsg: boolean = false;
  baseUrl = environment.baseUrl;
  prevUrl: string;

  reportForm = new FormGroup({
    url: new FormControl(''),
    user: new FormControl(''),
    slug: new FormControl(''),
    reason: new FormControl(''),
    message: new FormControl(''),
  })

  messageText: string;
  reportFormSubmitting: boolean = false;

  constructor(
    private profileS: ProfileService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private translocoS: TranslocoService,
  ) {
      this.route.paramMap.subscribe(params => {
        this.reportForm.get('slug').setValue(params.get('profile'));
        this.reportForm.get('user').setValue(params.get('user'));
        this.reportForm.get('url').setValue(params.get('profile') );
      }
    )
    this.prevUrl = this.route.snapshot.queryParamMap.get('redirectTo');
  }

  ngOnInit(): void {
    this.getReasons();
    this.translocoS.selectTranslate("SEND_MESSAGE_SUCCESS").subscribe(
      data => this.messageText = data,
    )
  }

  successMessage(){
    this.snackBar.open(this.messageText, null, {
      duration: 6000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['custom-snackbar']
    });
  }

  getReasons() {
    this.profileS.reportReasons().subscribe(
      data => { this.reportReasonsList = data.data }
    )
  }

  onReportFormSubmit(){
    if( this.reportForm.valid ){
      this.reportFormSubmitting = true;
      this.profileS.report(this.reportForm.value).subscribe( data => {
        this.showSuccessMsg = true;
      },
      error => {},
      ()=>{
        this.reportFormSubmitting = false;
        this.successMessage();
        this.cancel();
      })  
    }
    
  }

  cancel(){
    this.router.navigateByUrl('/' + this.reportForm.value.slug);
  }



}
