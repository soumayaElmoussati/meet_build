import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { ProjectService } from 'src/app/shared/services/project.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-report-project',
  templateUrl: './report-project.component.html',
  styleUrls: ['./report-project.component.scss']
})
export class ReportProjectComponent implements OnInit {

  projectSlug;
  reportReasonsList = null;
  showSuccessMsg: boolean = false;
  baseUrl = environment.baseUrl;

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
    private projectS: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private translocoS: TranslocoService 
  ) {
      this.route.paramMap.subscribe(params => {
        this.reportForm.get('user').setValue(params.get('user'));
        this.reportForm.get('slug').setValue(params.get('slug'));
        this.reportForm.get('url').setValue('projets/'+params.get('slug') );
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
    this.projectS.reportReasons().subscribe(
      data => { this.reportReasonsList = data.data }
    )
  }

  onReportFormSubmit(){
    if( this.reportForm.valid ){
      this.reportFormSubmitting = true;
      this.projectS.report(this.reportForm.value).subscribe( data => {
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
    this.router.navigateByUrl('/projets/'+ this.reportForm.value.slug );
  }



}
