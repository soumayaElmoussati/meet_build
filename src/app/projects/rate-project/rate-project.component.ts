import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { ProjectService } from 'src/app/shared/services/project.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-rate-project',
  templateUrl: './rate-project.component.html',
  styleUrls: ['./rate-project.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'fields'
    }
  ]
})
export class RateProjectComponent implements OnInit {

  profileImgUrl = environment.profileImgUrl;

  rateForm = new FormGroup({
    value : new FormControl(0),
    evaluation : new FormControl(),
  })

  constructor(
    private projectS: ProjectService,
    public dialogRef: MatDialogRef<RateProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit(): void {
  }

  onRateFormSubmit(){
    if(this.rateForm.valid) this.dialogRef.close(this.rateForm.value);
  }

  close(){
    this.dialogRef.close();
  }

}
