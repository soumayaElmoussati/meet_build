import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { DiscussService } from 'src/app/shared/services/discuss.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-report-poste',
  templateUrl: './report-poste.component.html',
  styleUrls: ['./report-poste.component.scss']
})
export class ReportPosteComponent implements OnInit {

  projectSlug;
  reportReasonsList = null;
  showSuccessMsg: boolean = false;

  baseUrl = environment.baseUrl;

  reportForm = new FormGroup({
    id: new FormControl(''),
    url: new FormControl(''),
    user: new FormControl(''),
    reason: new FormControl(''),
    message: new FormControl(''),
  })
  messageText: string;
  reportFormSubmitting: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private discussS: DiscussService,
    private snackBar: MatSnackBar,
    private translocoS: TranslocoService
  ) {
    this.discussS.signalePage.next(true);
      this.route.paramMap.subscribe(params => {
        this.reportForm.get('user').setValue(params.get('user'));
        this.reportForm.get('id').setValue(params.get('id'));
      }
    )
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
    this.discussS.reportReasons().subscribe(
      data => { this.reportReasonsList = data.data }
    )
  }

  onReportFormSubmit(){
    if( this.reportForm.valid ){
      this.reportFormSubmitting = true;
      this.discussS.report(this.reportForm.value).subscribe( data => {
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
    this.discussS.signalePage.next(false);
    this.router.navigateByUrl( '/discuss/postes' );
  }



}
