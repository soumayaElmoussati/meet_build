import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoService, TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { AdminService } from 'src/app/shared/services/admin.service';
import { ProjectService } from 'src/app/shared/services/project.service';
import { AddNewCategoryComponent } from '../moderation-categories/add-new-category/add-new-category.component';
import { ActionResultComponent } from '../../shared/dialogs/action-result/action-result.component';

@Component({
  selector: 'app-moderation-code-nace-assignment',
  templateUrl: './moderation-code-nace-assignment.component.html',
  styleUrls: ['./../admin.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'fields'
    }
  ]
})
export class ModerationCodeNaceAssignmentComponent implements OnInit {

  categoriesList: any = [];
  subCategoriesList: any = [];
  competencesList: any = [];
  selectedCategory: string;
  selectedSubCategory: string;

  codeForm = new FormGroup({
    id: new FormControl(''),
    subCategory: new FormControl('', Validators.required),
    status: new FormControl(1),
    description: new FormControl('', Validators.required),
  })

  constructor(
    private adminS: AdminService,
    private projectS: ProjectService,
    private translocoS: TranslocoService,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.translocoS.selectTranslate('ACTIVATION_OF_A_NACE_CODE', null, 'admin').subscribe(value => this.adminS.dataTitle.next(value));
    this.adminS.dataSubTitle.next(null);
    this.adminS.dataBackTo.next('/admin/moderation/code-nace');
    this.adminS.currentLinkParam.next({ parent:5, child:3 });
    this.route.paramMap.subscribe(
      param => {
        this.codeForm.get('id').setValue(param.get('id'));
        this.codeForm.get('description').setValue(param.get('description'));
      }
    )
  }

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(){
    this.projectS.getCategories().subscribe(
      data => { this.categoriesList = data.data }
    )
  }

  getSubCategories(id){
    this.selectedCategory = id;
    this.projectS.getSubCategories(id).subscribe(
      data => {
        this.subCategoriesList = data.data;
        this.competencesList = [];
        this.selectedSubCategory = null;
      }
    )
  }

  getcompetences(id){
    this.selectedSubCategory = id;
    this.codeForm.get('subCategory').setValue(id);
  }

  addCategory(type, category, index, action){
    let title: string;
    let parent_id: string;
    if(action == 'edit'){
      switch(type){
        case 'category':
          parent_id = null;
          title = 'admin.EDIT_A_MOTHER_CATEGORY'; break;
        case 'subcategory':
          parent_id = this.selectedCategory;
          title = 'admin.EDIT_A_SUB_CATEGORY'; break;
        case 'skill':
          parent_id = this.selectedSubCategory;
          title = 'admin.EDIT_A_SKILL'; break;
      }
    }else{
      switch(type){
        case 'category':
          parent_id = null;
          title = 'admin.ADD_A_MOTHER_CATEGORY'; break;
        case 'subcategory':
          parent_id = this.selectedCategory;
          title = 'admin.ADD_A_SUB_CATEGORY'; break;
        case 'skill':
          parent_id = this.selectedSubCategory;
          title = 'admin.ADD_A_SKILL'; break;
      }
    }
    
    const dialog = this.dialog.open(AddNewCategoryComponent, {
      data: {
        type: type,
        action: action,
        category: {
          parent_id: parent_id,
          id: category?.id,
          name: category?.name,
          code_nace: category?.code_nace,
        },
        cancelBtn: "CANCEL",
        confirmBtn: "REGISTER",
        title : title
      },
      width: '500px',
      height: 'auto',
      disableClose: true
    });

    dialog.afterClosed().subscribe(data => {
      if(data){
         if(data.action == 'edit'){
           switch(type){
            case 'category':
              this.categoriesList[index].name = data.data.name; break;
            case 'subcategory':
              this.subCategoriesList[index].name = data.data.name; break;
            case 'skill':
              this.competencesList[index].name = data.data.name; break;
           }
         }else{
          switch(type){
            case 'category':
              this.categoriesList.push(data.data); break;
            case 'subcategory':
              this.subCategoriesList.push(data.data); break;
            case 'skill':
              this.competencesList.push(data.data); break;
           }
         }
      }
    })
  }

  onCodeFormSubmit(){
    if(this.codeForm.valid){
      this.adminS.changeCodeNaceStatus(this.codeForm.value).subscribe(
        data => { this.assignmentResult(true) },
        error => { this.assignmentResult(false) },
        () => {}
      )
    }
  }

  assignmentResult(val: boolean){
    let data;
    if(val){
      data = {
        result: val,
        title: 'WELL_DONE',
        description: 'NACE_CODE_HAS_BEEN_SUCCESSFULLY_ADDED_IN_SELECTED_CATEGORY'
      }
    }else{
      data = {
        result: val,
        title: 'AN_ERROR_HAS_OCCURRED',
        description: ''
      }
    }
    const dialog = this.dialog.open(ActionResultComponent, {
      data: data,
      width: '500px',
      height: 'auto',
      disableClose: true
    });

    dialog.afterClosed().subscribe(data => {
      if(data){
        this.router.navigateByUrl('/admin/moderation/code-nace');
      }
    })
  }

}
