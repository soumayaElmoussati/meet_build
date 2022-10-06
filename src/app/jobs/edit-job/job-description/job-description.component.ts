import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { JobService } from 'src/app/shared/services/job.service';
@Component({
  selector: 'app-job-description',
  templateUrl: './job-description.component.html',
  styleUrls: ['./job-description.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'fields'
    }
  ]
})
export class JobDescriptionComponent implements OnInit {
  jobCategoriesList = [];
  jobSubCategoriesList = [];
  jobForm = new FormGroup({
    id: new FormControl(''),
    category: new FormControl('', Validators.required),
    sous_category: new FormControl('', Validators.required),
    function: new FormControl('', Validators.required ),
    description: new FormControl(),
  });
  constructor(    
    private jobS: JobService,
    public dialogRef: MatDialogRef<JobDescriptionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.getJobCategories();
    this.jobForm.patchValue(this.data);
    this.jobForm.get('category').valueChanges.subscribe(
      data => this.getJobSubCategories()
    );
  }

  getJobCategories(){
    this.jobS.getCategories().subscribe(
      data => {
        this.jobCategoriesList = data.data;
        let indexOfCategory = this.jobCategoriesList.find(item => item.name == this.jobForm.get('category').value.name);
        this.jobForm.get('category').setValue(indexOfCategory);
        this.getJobSubCategories();
      }
    )
  }

  getJobSubCategories(){
    this.jobS.getSubCategories(this.jobForm.get('category').value.id).subscribe(
      data => {
        this.jobSubCategoriesList = data.data;
        let indexOfSubCategory = this.jobSubCategoriesList.find(item => item.name == this.jobForm.get('sous_category').value.name);
        this.jobForm.get('sous_category').setValue(indexOfSubCategory);
      }
    )
  }

  onJobFormSubmit(){
    if(this.jobForm.valid){
      this.jobS.editDescription(this.jobForm.value).subscribe(
        data => { },
        error => { },
        () => { this.close(this.jobForm.value) }
      )
    }
  }

  close(data){
    this.dialogRef.close(data);
  }
}
