import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationComponent } from 'src/app/shared/dialogs/confirmation/confirmation.component';
import { ProjectService } from 'src/app/shared/services/project.service';

@Component({
  selector: 'app-project-files',
  templateUrl: './project-files.component.html',
  styleUrls: ['./project-files.component.scss']
})
export class ProjectFilesComponent implements OnInit {

  projectForm = new FormGroup({
    files: new FormControl(),
  });
  

  selectedFiles?: FileList;
  filesInfos: any[] = [];
  files: FileList;
  filePath = [];
  
  constructor(
    private projectS: ProjectService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ProjectFilesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.data.files.forEach(element => {
      this.filePath.push( element.name );
      this.filesInfos.push(
        {
          id: element.id,
          fileName: element.name,
          newName: element.path,
          deleted: false,
          progress: 100,
        }
      )
    });
  }

  onProjectFormSubmit(){
    this.projectS.editFiles({ fichiers: this.filesInfos }, this.data.id).subscribe(
      resp => { 
       this.dialogRef.close(resp);
      }
    )
  }

  onUploadFiles(event){
    this.selectedFiles = event.target.files;

    if (this.selectedFiles) {
      for (let i = 0 ; i < this.selectedFiles.length; i++) {
        this.upload(i + this.filePath.length, this.selectedFiles[i]);
        const reader = new FileReader();
        reader.onload = (e:any) => {
          this.filePath[this.filePath.length] = reader.result as string;
        }
        reader.readAsDataURL(this.selectedFiles[i]);
   
      }
    }
  }

  upload(idx, file){
    this.filesInfos[idx] = { progress: 0, fileName: file.name, newName: file.name, deleted : false };
    if (file) {
      this.projectS.upload(file).subscribe(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.filesInfos[idx].progress = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            const msg = 'Uploaded the file successfully: ' + file.name;
            this.filesInfos[idx].newName = event.body.fileName; 
          }
        },
        (err: any) => {
          this.filesInfos[idx].progress = 0;
          const msg = 'Could not upload the file: ' + file.name;
        });
    }
  }

  deleteFile(i){
    this.filesInfos[i].newName.deleted = true;
  }

  onDeleteFile(id){
    const dialog = this.dialog.open( ConfirmationComponent , {
      data : {
        title: 'ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_FILE',
        content: "THIS_FILE_WILL_BE_PERMANENTLY_DELETED_ARE_YOU_SURE_YOU_WANT_TO_DELETE_IT",
        confirmBtn: 'YES',
        cancelBtn: 'NO' 
      },
      width: '400px',
      height: 'auto',
      disableClose: true
    });
    dialog.afterClosed().subscribe(result => {
      if(result && result.confirm){
        if(this.filesInfos[id].id){
          this.filesInfos[id].deleted = true;
        }
        else{
          this.projectS.deleteFiles({ fileName : this.filesInfos[id].newName }).subscribe(
            data => {},
            error => {},
            () => {
              this.filesInfos.splice(id, 1);
              this.filePath.splice(id, 1);
            }
          )
        }
      }
    })
  }

  /*
  deleteFile(i){
    const data = { fileName: this.filesInfos[i].newName};
    this.projectS.deleteFiles(data).subscribe(
      data => { this.filesInfos[i].delete = true; },
      error => {},
      () => {}
    )
  }
  */

  close(){
    this.filesInfos.forEach(element => {
      if( !element.id ){
        this.projectS.deleteFiles({ fileName : element.newName }).subscribe(
          data => {},
          error => {},
          () => {}
        )
      }
    })
    this.dialogRef.close();
  }

}
