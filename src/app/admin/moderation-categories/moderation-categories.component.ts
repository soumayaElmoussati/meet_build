import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { AdminService } from 'src/app/shared/services/admin.service';
import { ProjectService } from 'src/app/shared/services/project.service';
import { AddNewCategoryComponent } from './add-new-category/add-new-category.component';

@Component({
  selector: 'app-moderation-categories',
  templateUrl: './moderation-categories.component.html',
  styleUrls: ['./../admin.component.scss'],
})
export class ModerationCategoriesComponent implements OnInit {

  categoriesList: any = [];
  subCategoriesList: any = [];
  competencesList: any = [];
  selectedCategory: string;
  selectedSubCategory: string;

  constructor(
    private adminS: AdminService,
    private projectS: ProjectService,
    private translocoS: TranslocoService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.translocoS.selectTranslate('GATEGORIES_MANAGEMENT', null, 'admin').subscribe(value => this.adminS.dataTitle.next(value));
    this.adminS.dataSubTitle.next(null);
    this.adminS.dataBackTo.next('/admin');
    this.adminS.currentLinkParam.next({ parent:5, child:2 });
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
        console.log(this.subCategoriesList.length);
        this.competencesList = [];
        this.selectedSubCategory = null;
      }
    )
  }

  getcompetences(id){
    this.selectedSubCategory = id;
    this.projectS.getCompetencesFromSubCategory(id).subscribe(
      data => { this.competencesList = data.data }
    )
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

}
