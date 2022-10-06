import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';

@Component({
  selector: 'app-send-request',
  templateUrl: './send-request.component.html',
  styleUrls: ['../../login/login.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'fields'
    }
  ]
})
export class SendRequestComponent implements OnInit {

  requestForm = new FormGroup({
    email: new FormControl('', {validators: [Validators.required, Validators.pattern('^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$')]})
  }); 
  responseMessage=null

  constructor(
    private authService : AuthService
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
  
    if (this.requestForm.valid) {
      
      this.authService.sendRequest({
       email: this.requestForm.value.email,
       path: location.origin+'/reset-password'
      }).subscribe(
          (data) => {
            this.responseMessage=data.message
          
          },
          (error) => this.responseMessage=error.error.error,
          () => {
           
          }
        );
    }
    
  }

}
