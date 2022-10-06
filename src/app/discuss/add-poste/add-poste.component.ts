import { Component, OnInit } from '@angular/core';
import { DiscussService } from '../../shared/services/discuss.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpEventType, HttpResponse } from '@angular/common/http';


@Component({
  selector: 'app-add-poste',
  templateUrl: './add-poste.component.html',
  styleUrls: ['./add-poste.component.scss']
})
export class AddPosteComponent implements OnInit {


  posteFileUrl = environment.posteFileUrl

  /*
  postForm = new FormGroup({
    description: new FormControl(''),
    filesToAdd: new FormControl([])
  });
  filePath = []
  filesInfos: any[] = [];
  progress = 0
  */
  selectedFiles?: FileList;
  filesInfos: any[] = [];
  message: string[] = [];
  files: FileList;
  filePath = [];
  postFormSubmitting = false;

  postForm = new FormGroup({
    description: new FormControl(''),
    filesToAdd: new FormControl([])
  });

  constructor(
    private discussS: DiscussService,
    private dialogRef: MatDialogRef<AddPosteComponent>,
  ) { }

  ngOnInit() {}

  onPostFormSubmit() {
    if (this.postForm.valid) {
      this.postFormSubmitting = true;
      let filesToAdd = this.filesInfos.filter(elem => (elem.delete == false));
      const data = {
        description: this.postForm.get('description').value,
        filesToAdd: filesToAdd,
      }
      this.discussS.addPost(data).subscribe(
        data => { this.postFormSubmitting = false },
        error => { this.postFormSubmitting = false },
        () => {
          this.close(true);
        }
      )
    }
  }

  onUploadImages(event) {
    this.message = [];
    this.selectedFiles = event.target.files;
    let y = 0;
    let type: string;
    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        type = this.selectedFiles[i].type.split('/')[0];
        this.upload(i + this.filePath.length, this.selectedFiles[i], type);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.filePath[this.filePath.length] = reader.result as string;
        }
        reader.readAsDataURL(this.selectedFiles[i]);
        y++;
      }
    }
  }

  upload(idx, file, type) {
    this.filesInfos[idx] = {
      progress: 0,
      fileName: file.name,
      delete: false,
      type: type
    };
    if (file) {
      this.discussS.uploadFile(file).subscribe(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.filesInfos[idx].progress = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            const msg = 'Uploaded the file successfully: ' + file.name;
            this.filesInfos[idx].newName = event.body.fileName;
            this.message.push(msg);
          }
        },
        (err: any) => {
          this.filesInfos[idx].progress = 0;
          const msg = 'Could not upload the file: ' + file.name;
          this.message.push(msg);
        });
    }
  }

  close(added) {
    let data = this.filesInfos.filter(elem => (elem.delete == true));
    this.discussS.deleteFile(data.map(a => a.newName)).subscribe(
      data => { },
      error => { },
      () => { }
    )
    this.dialogRef.close({added: added});
  }


}