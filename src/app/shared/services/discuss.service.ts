
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiscussService {

  apiUrl = environment.apiUrl;

  refrechData = new BehaviorSubject<boolean>(false);
  changeVar = this.refrechData.asObservable();


  searchData = new BehaviorSubject<string>('');
  changeSearchVar = this.searchData.asObservable();

  signalePage = new BehaviorSubject<boolean>(false);
  changesignalePageVar = this.signalePage.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  getPostes(perPage, page, id, search): any {
    if(id){
      return this.http.get(this.apiUrl + 'posts/' + id);
    }else{
      if(search?.length > 2) return this.http.get(this.apiUrl + 'posts/getAllPost/' + perPage + '/' + search + '?page=' + page);
      else return this.http.get(this.apiUrl + 'posts/getAllPost/' + perPage + '?page=' + page);
    }
  }

  getNotifications(): any {
    return this.http.get(this.apiUrl + 'posts/getNotifications');
  }

  /*
  uploadPostFile(file): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http.post(this.apiUrl + 'posts/uploadPostFile', formData, {
      reportProgress: true,
      responseType: 'json'
    });
  }
  */

  uploadFile(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    const req = new HttpRequest('POST', `${this.apiUrl}posts/uploadPostFile`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }

  addPost(data): any {
    return this.http.post(this.apiUrl + 'posts', data);

  }

  deleteFile(data) {
    return this.http.post(this.apiUrl + 'posts/deletePostFile', { fileName: data });
  }
  
  like(data):any {
    return this.http.post(this.apiUrl + 'posts/like', data);
  }
  
  sendComment(data):any{
    return this.http.post(this.apiUrl + 'posts/comment', data);
  }
  sendResponse(data):any{
    return this.http.post(this.apiUrl + 'posts/comment_comment', data);
  }

  getSubscriptions(): any{
    return this.http.get(this.apiUrl + 'posts/getFollowedProfil');
  }
  getSubscribers(): any{
    return this.http.get(this.apiUrl + 'posts/getFollowerProfil');
  }

  loadData(data):any{
    return this.http.post(this.apiUrl + 'posts/getNewPostsData', data);
  }

  reportReasons():any {
    return this.http.get(this.apiUrl + 'reportReasons/getPostReportReasons') ;
  }
  report(data):any {
    return this.http.post(this.apiUrl + 'posts/reportPost', data) ;
  }

  suggestions():any {
    return this.http.get(this.apiUrl + 'posts/suggestions') ;
  }

}
