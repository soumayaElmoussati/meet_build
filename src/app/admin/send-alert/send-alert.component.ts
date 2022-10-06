import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslocoService, TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { AdminService } from 'src/app/shared/services/admin.service';

@Component({
  selector: 'app-send-alert',
  templateUrl: './send-alert.component.html',
  styleUrls: ['./../admin.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'admin'
    }
  ]
})
export class SendAlertComponent implements OnInit {

  quillConfiguration = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'bullet' }]

    ]
  };

  emailForm = new FormGroup({
    email: new FormControl({value: '', disabled: true}),
    cc: new FormControl(''),
    subject: new FormControl('Il semblerait que vous ayez violé les conditions générales'),
    message: new FormControl('<p>Cher client,</p><p><br></p><p>Nous vous suspectons d’avoir violé nos conditions générales d’utilisation. Les violations sont les suivantes:</p><p><br></p><p>Nous vous demandons de supprimer/ou&nbsp;modifier ceci éndéans les 24h sous peine de voir votre compte se faire désactiver.</p><p><br></p><p>Cordialement,</p><p>Le service client de Meet &amp; Build</p><p><br></p>'),
    copy: new FormControl(false),
    read: new FormControl(false),
  });

  constructor(
    private adminS: AdminService,
    private translocoS: TranslocoService,
    private route: ActivatedRoute
  ) {
    this.translocoS.selectTranslate('SEND_AN_ALERT', null, 'admin').subscribe(value => this.adminS.dataTitle.next(value));
    this.adminS.dataSubTitle.next(null);
    this.adminS.dataBackTo.next('/admin/utilisateurs');
    this.route.paramMap.subscribe(
      param => this.emailForm.get('email').setValue( param.get('email') )
    );
    this.adminS.currentLinkParam.next({ parent:2, child:0 });
  }

  ngOnInit(): void {
  }

  onEmailFormSubmit(){
    if( this.emailForm.valid ){
      let data = this.emailForm.value;
      data.email = this.emailForm.get('email').value;
      this.adminS.sendAlert(data).subscribe(
        data => {}
      )
    }
  }

}
