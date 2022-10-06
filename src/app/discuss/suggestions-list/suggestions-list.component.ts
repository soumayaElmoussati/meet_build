import { Component, OnInit } from '@angular/core';
import { DiscussService } from 'src/app/shared/services/discuss.service';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-suggestions-list',
  templateUrl: './suggestions-list.component.html',
  styleUrls: ['./suggestions-list.component.scss']
})
export class SuggestionsListComponent implements OnInit {

  suggestionsList: any;
  profileImgUrl = environment.profileImgUrl;

  constructor(
    private discussS: DiscussService,
    private profileS: ProfileService,
  ) { }

  ngOnInit(): void {
    this.getSuggestionsList();
  }

  getSuggestionsList(){
    this.discussS.suggestions().subscribe(
      data => this.suggestionsList = data.data
    )
  }

  likeProfile(id){ 
      this.profileS.like(id).subscribe(
        data => {
          this.getSuggestionsList();
        },
        error => {},
        () => {}
      ) 
  }

}
