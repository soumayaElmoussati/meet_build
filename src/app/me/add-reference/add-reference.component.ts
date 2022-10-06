import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { Observable } from 'rxjs';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { environment } from 'src/environments/environment.prod';
import { UploadFilesService } from './../../shared/services/upload-files.service'
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-add-reference',
  templateUrl: './add-reference.component.html',
  styleUrls: ['./add-reference.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'fields'
    }
  ]
})
export class AddReferenceComponent implements OnInit {

  selectedFiles?: FileList;
  filesInfos: any[] = [];
  message: string[] = [];
  files: FileList;
  filePath = [];
  referencFormSubmitting = false;
  referenceImgUrl = environment.referenceImgUrl;
 

  fileInfos?: Observable<any>;

  referenceForm = new FormGroup({
    id: new FormControl(''),
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
  }); 


  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  userCtrl = new FormControl();
  filteredUsers: Observable<string[]>;
  users: any = [];
  allUsers = [];

  @ViewChild('userInput') fruitInput: ElementRef;
 
  constructor(
    private uploadS: UploadFilesService,
    private profileS: ProfileService,
    public dialogRef: MatDialogRef<AddReferenceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  

  ngOnInit(): void {
    this.getUsers();
    if(this.data){
      this.referenceForm.patchValue(this.data);
      this.data.files.forEach(element => {
        this.filesInfos.push({
          progress: 100,
          fileName: element.name,
          status : 'old',
          delete : false 
        })
        this.filePath.push(this.referenceImgUrl + element.name)
      });  
    }
  }

  getUsers(){
    let result;
    this.profileS.allUsers().subscribe(
      data => { result = data },
      error => {},
      () => {
        this.allUsers = result.data;
        if(this.data){ // remplir la liste des utilisateur déjà selectionner
          this.data.serviceProviders.forEach(element => {
            if(element.slug){
              let index = this.allUsers.findIndex(a => a.slug == element.slug);
              this.users.push(this.allUsers[index]);
            }else{
              this.users.push(element);
            }
          });
        }
        this.filteredUsers = this.userCtrl.valueChanges.pipe(
          startWith(null),
          map((fruit: string | null) =>
            fruit ? this._filter(fruit) : this.allUsers.slice()
          )
        );
      }
    )
  }

  
  add(event: MatChipInputEvent): void {
    //debugger;
    const input = event.input;
    const value = event.value;
    // Add our fruit
    if ((value || '').trim()) {
      this.users.push({
        id: Math.random(),
        email: value.trim()
      });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.userCtrl.setValue(null);
  }

  remove(fruit, indx): void {
    this.users.splice(indx, 1);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.users.push(event.option.value);
    this.fruitInput.nativeElement.value = '';
    this.userCtrl.setValue(null);
  }

  private _filter(value: any): any[] { 
    if(value.length){
      return this.allUsers.filter(fruit =>
        fruit.email.toLowerCase().includes(value.toLowerCase())
      );  
    }
    
  }
 


  onReferenceFormSubmit(){
    if( this.referenceForm.valid && this.referenceHasFiles() ){
      this.referencFormSubmitting = true;
      let filesToAdd = this.filesInfos.filter(elem => ( elem.delete == false && elem.status == 'new' )); 
      filesToAdd = filesToAdd.map(a => a.fileName);
      let filesToDelete = this.filesInfos.filter(elem => ( elem.delete == true && elem.status == 'old' )); 
      filesToDelete = filesToDelete.map(a => a.fileName);
      const data = {
        id: this.referenceForm.get('id').value,
        title: this.referenceForm.get('title').value,
        description: this.referenceForm.get('description').value,
        filesToAdd: filesToAdd,
        filesToDelete: filesToDelete,
        service_providers: this.users.map(a => a.email)
      }
 
      if(data.id){
        this.profileS.editReference(data).subscribe(
          data => { this.referencFormSubmitting = false },
          error => { this.referencFormSubmitting = false },
          () => {
            this.close();
          }
        )
      }else{
        this.profileS.addReference(data).subscribe(
          data => { this.referencFormSubmitting = false },
          error => { this.referencFormSubmitting = false },
          () => {
            this.close();
          }
        )
      } 
      


    }else if(!this.referenceHasFiles()){
      //console.log('no files');
    }else{
      //console.log('error');
    }
  }

  referenceHasFiles(): boolean{
    if( this.filesInfos.length == 0 ) return false;
    if( this.filesInfos.filter(elem => ( elem.delete == false )).length == 0 ) return false;
    return true;
  }

  onUploadImages(event){
    this.message = [];

    this.selectedFiles = event.target.files;
    let y = 0;
    if (this.selectedFiles) {
      for (let i = 0 ; i < this.selectedFiles.length; i++) {
        this.upload(i + this.filePath.length, this.selectedFiles[i]);
        const reader = new FileReader();
        reader.onload = (e:any) => {
          this.filePath[this.filePath.length] = reader.result as string;
        }
        reader.readAsDataURL(this.selectedFiles[i]);
        y++;
      }
    }
  }

  upload(idx, file){
    this.filesInfos[idx] = { progress: 0, fileName: file.name, status : 'new', delete : false };
    if (file) {
      this.uploadS.upload(file).subscribe(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.filesInfos[idx].progress = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            const msg = 'Uploaded the file successfully: ' + file.name;
            //console.log(event);
            this.filesInfos[idx].fileName = event.body.fileName; 
            this.message.push(msg);
            //this.fileInfos = this.uploadS.getFiles();
          }
        },
        (err: any) => {
          this.filesInfos[idx].progress = 0;
          const msg = 'Could not upload the file: ' + file.name;
          this.message.push(msg);
          //this.fileInfos = this.uploadS.getFiles();
        });
    }
  }
 

  close(){
    let data = this.filesInfos.filter(elem => ( elem.delete == true && elem.status == 'old' ));
    this.uploadS.deleteFiles(data.map(a => a.fileName)).subscribe(
      data => {},
      error => {},
      () => {}
    )
    this.dialogRef.close();
  }



}
