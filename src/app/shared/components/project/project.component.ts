import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HelpersService } from '../../services/helpers.service';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

  @Input() project;
  profileImgUrl = environment.profileImgUrl;

  constructor(
    private helpersS: HelpersService, // used on component
    private projectS: ProjectService,
  ) { }

  ngOnInit(): void {
  }

  downloadFiles(id){
    this.projectS.downloadFiles(id).subscribe(
      (data) => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(data);
        a.href = objectUrl;
        a.download = 'test.zip';
        a.click();
        URL.revokeObjectURL(objectUrl);

      },
      (error) => console.log(error)
    );

  }

}
