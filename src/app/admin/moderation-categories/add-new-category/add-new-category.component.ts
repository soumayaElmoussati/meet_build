import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { AdminService } from 'src/app/shared/services/admin.service';

@Component({
  selector: 'app-add-new-category',
  templateUrl: './add-new-category.component.html',
  styleUrls: ['./../../admin.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'fields'
    }
  ]
})
export class AddNewCategoryComponent implements OnInit {
  
    categoryForm =new FormGroup({
      parent_id: new FormControl(''),
      id: new FormControl(''),
      name: new FormControl(''),
      code_nace: new FormControl(''),
    })
    formSubmiting: boolean = false;
  
    constructor(
      public adminS: AdminService,
      public dialog: MatDialog,
      public dialogRef: MatDialogRef<AddNewCategoryComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      ) {
        this.categoryForm.get('parent_id').setValue(this.data.category.parent_id);
        this.categoryForm.get('id').setValue(this.data.category.id);
        this.categoryForm.get('name').setValue(this.data.category.name);
        this.categoryForm.get('code_nace').setValue(this.data.category.code_nace);
      }
  
    ngOnInit(): void {}
  
    onCancel(){
      this.dialogRef.close();
    }
  
    onConfirm(){
      if(this.categoryForm.valid){
        this.formSubmiting = true;
        let result;
        this.adminS.addProjectCategory(this.categoryForm.value, this.data.type).subscribe(
          data => {
            result = data;
          },
          error => {},
          () => {
            this.formSubmiting = false;
            this.dialogRef.close({ data: result.result , action: this.data.action });
          }
        )  
      }
      
      
    }
   
  }
  