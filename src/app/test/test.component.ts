import { isPlatformBrowser } from '@angular/common';
import { APP_ID, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  items: any;
  loaded: boolean;
  constructor(
    //private itemsService: ItemsService,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string) {
      this.loaded = false;
  }


  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    const platform = isPlatformBrowser(this.platformId) ?
            'in the browser' : 'on the server';
          console.log(`getUsers : Running ${platform} with appId=${this.appId}`);
          this.loaded = true;
          /*
    this.itemsService.getItems('https://jsonplaceholder.typicode.com/users')
      .subscribe(
        items => {
          const platform = isPlatformBrowser(this.platformId) ?
            'in the browser' : 'on the server';
          console.log(`getUsers : Running ${platform} with appId=${this.appId}`);
          this.loaded = true;
          this.items = items;
        });*/
  }

  resetUsers(): void {
    this.items = null;
    this.loaded = true;
  }
}
