import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { ProjectService } from 'src/app/shared/services/project.service';

@Component({
  selector: 'app-project-description',
  templateUrl: './project-description.component.html',
  styleUrls: ['./project-description.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'fields'
    }
  ]
})
export class ProjectDescriptionComponent implements OnInit {

  projectCategoriesList = [];
  projectSubCategoriesList = [];
  projectForm = new FormGroup({
    id: new FormControl(''),
    category: new FormControl('', Validators.required),
    sous_category: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required ),
    description: new FormControl(),
  });

  constructor(
    private projectS: ProjectService,
    public dialogRef: MatDialogRef<ProjectDescriptionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit(): void {
    this.getProjectCategories();
    this.projectForm.patchValue(this.data);
    this.projectForm.get('category').valueChanges.subscribe(
      data => this.getProjectSubCategories()
    );
  }

  getProjectCategories(){
    this.projectS.getCategories().subscribe(
      data => {
        this.projectCategoriesList = data.data;
        let indexOfCategory = this.projectCategoriesList.find(item => item.name == this.projectForm.get('category').value.name);
        this.projectForm.get('category').setValue(indexOfCategory);
        this.getProjectSubCategories();
      }
    )
  }

  getProjectSubCategories(){
    this.projectS.getSubCategories(this.projectForm.get('category').value.id).subscribe(
      data => {
        this.projectSubCategoriesList = data.data;
        let indexOfSubCategory = this.projectSubCategoriesList.find(item => item.name == this.projectForm.get('sous_category').value.name);
        this.projectForm.get('sous_category').setValue(indexOfSubCategory);
      }
    )
  }

  onProjectFormSubmit(){
    if(this.projectForm.valid){
      this.projectS.editDescription(this.projectForm.value).subscribe(
        data => { },
        error => { },
        () => { this.close(this.projectForm.value) }
      )
    }
  }

  close(data){
    this.dialogRef.close(data);
  }
}
