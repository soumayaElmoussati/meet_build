import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NotConnectedComponent } from 'src/app/shared/dialogs/not-connected/not-connected.component';
import { HelpersService } from 'src/app/shared/services/helpers.service';
import { ProjectService } from 'src/app/shared/services/project.service';
import { TokenService } from 'src/app/shared/services/token.service';
import { environment } from 'src/environments/environment.prod';
import { ProjectDescriptionComponent } from '../edit-project/project-description/project-description.component';
import { ProjectDetailsComponent } from '../edit-project/project-details/project-details.component';
import { ProjectFilesComponent } from '../edit-project/project-files/project-files.component';
import { RateProjectComponent } from '../rate-project/rate-project.component';

@Component({
  selector: 'app-detail-project',
  templateUrl: './detail-project.component.html',
  styleUrls: ['./detail-project.component.scss']
})
export class DetailProjectComponent implements OnInit {

  projectSlug: string;
  project: any;
  profileImgUrl = environment.profileImgUrl;
  allowEdit = false;
  changingStatus = false;

  constructor(
    private projectS: ProjectService,
    private helpersS: HelpersService, // used on component
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private tokenS: TokenService,
    private title: Title,
    private meta: Meta,
  ) {
    this.route.paramMap.subscribe(params => {
      this.projectSlug = params.get('slug');
    });
  }

  ngOnInit(): void {
    this.getProject();
  }

  getProject(){
    this.projectS.getProjectDetail(this.projectSlug).subscribe(
      data => { 
        this.project = data.data;
        this.title.setTitle(this.project.name);
        this.meta.updateTag({property: 'og:title', content: this.project.name});
        this.meta.updateTag({property: 'og:description', content: this.project.description});
      }
    )
  }

  setRouter(path){
    this.router.navigateByUrl(path)
  }

  downloadFile(fileName, filePath){
    this.projectS.downloadFile(filePath).subscribe(
      data => {
        let file = new Blob([<any>data], { type: 'application/pdf' });
        let url = window.URL.createObjectURL(file);
        let a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      }
    )
  }

  editDescription(){
    const dialog = this.dialog.open( ProjectDescriptionComponent , {
      data: this.project,
      width: '700px',
      height: 'auto',
      disableClose: true
    });

    dialog.afterClosed().subscribe(data => {
      if( data ){
        this.project.name = data.name;
        this.project.description_br = data.description;
        this.project.description = data.description;
        this.project.category = data.category;
        this.project.sous_category = data.sous_category;
      }
    })
  }

  editDetails(){
    const dialog = this.dialog.open( ProjectDetailsComponent , {
      data: this.project,
      width: '700px',
      height: 'auto',
      disableClose: true
    });

    dialog.afterClosed().subscribe(data => {
      if( data ){
        this.project.address = data.address;
        this.project.competences = data.competences;
        this.project.startdate = data.startdate;
        this.project.enddate = data.enddate;
        this.project.languages = data.languages;
        this.project.distance = data.distance;
      }
    })
  }

  editFiles(){
    const dialog = this.dialog.open( ProjectFilesComponent , {
      data: {
        files: this.project.files,
        id: this.project.id
      },
      width: '700px',
      height: 'auto',
      disableClose: true
    });

    dialog.afterClosed().subscribe(data => {
      if( data ){
         this.project.files = data.files;
      }
    })
  }

  onChangeProjectStatus(){
    this.changingStatus = true;
    if(this.project.status.name == 'OPEN'){
      this.projectS.closeProject(this.project.id, null).subscribe(
        data => { this.getProject() },
        error => {},
        () => { this.changingStatus = false }
        )
    }
    else if(this.project.status.name == 'CLOSED'){
      this.projectS.reOpenProject(this.project.id, null).subscribe(
        data => { this.getProject() },
        error => {},
        () => { this.changingStatus = false }
      )
    }
    else if(this.project.status.name == 'ASSIGNED'){
      const dialog = this.dialog.open( RateProjectComponent , {
        data: this.project.assigned_to_user,
        width: '700px',
        height: 'auto',
        disableClose: true
      });
  
      dialog.afterClosed().subscribe(data => {
        this.projectS.completeProject(this.project.id, data).subscribe(
          data => { this.getProject() },
          error => {},
          () => { this.changingStatus = false }
        )
      })
    }
  }

  apply(){ 
    if(this.tokenS.loggedIn() && this.tokenS.getRole()?.includes('mission')){
      this.router.navigateByUrl('/mes-postulations/conversation/' + this.project.id );
    }else{
      this.showAuthentificationMessage();
    }
  }

  showAuthentificationMessage(){
    const dialog = this.dialog.open( NotConnectedComponent , {
      data : {
        title: 'YOUR_MEET_AND_BUILD_ACCOUNT',
        content: "TO_PERFOM_THIS_ACTION_YOU_MUST_HAVE_AN_ENTREPRENEUR_ACCOUNT_AND_BE_IDENTIFIED_ON_THE_SITE",
        confirmBtn: 'REGISTRATION',
        cancelBtn: 'CONNECTION' 
      },
      width: '500px',
      height: 'auto',
    });
    dialog.afterClosed().subscribe(result => {
      if(result && result.confirm){
          
      }
    })
  }

  downloadFiles(id){
    this.projectS.downloadFiles(id).subscribe(
      (data) => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(data);
        a.href = objectUrl;
        a.download = this.project.slug + '.zip';
        a.click();
        URL.revokeObjectURL(objectUrl);

      },
      (error) => console.log(error)
    );

  }
  
}
