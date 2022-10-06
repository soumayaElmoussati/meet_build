import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  apiUrl = environment.apiUrl;
  
  constructor(
    private http: HttpClient
  ) { }

  getCategories(): any {
    return this.http.get(this.apiUrl + 'categories');
  }
  getSubCategories(category_id): any {
    return this.http.get(this.apiUrl + 'categories/getSousCategOfCateg/'+category_id);
  }

  getAllProjects(length, page, category_id, subCategory_id, status_id, month, province, order){
    return this.http.get(this.apiUrl + 'projects/getAllProjects/'+ length + '/' + status_id + '/' + category_id + '/' + subCategory_id + '/' + order + '/' + province + '/' + month + '?page=' + page )
  }
  getMyProjects(length, page, category_id,subCategory_id, status_id, order, distance, province, month){
    return this.http.get(this.apiUrl + 'projects/getMyProjects/'+ length + '/' + status_id + '/' + category_id +'/' + subCategory_id + '/' + order + '/' + distance  + '/' + province  + '/' + month + '?page=' + page )
  }

  getProjectStatus(){
    return this.http.get(this.apiUrl + 'project_statuses');
  }

  getProjectDetail(slug):any{
    return this.http.get(this.apiUrl + 'projects/showProject/'+slug);
  }
  getProjectDetailById(id): any{
    return this.http.get(this.apiUrl + 'projects/'+id);
  }

  getCompetences(): any{
    return this.http.get(this.apiUrl + 'competences');
  }
  getCompetencesFromSubCategory(id): any{
    if( id === undefined ) return this.http.get(this.apiUrl + 'competences');
    else return this.http.get(this.apiUrl + 'projects/getCompetencesofSousCateg/'+id);
  }

  getLanguages(){
    return this.http.get(this.apiUrl + 'languages');
  }

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    const req = new HttpRequest('POST', `${this.apiUrl}projects/uploadProjectFile`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }

  deleteFiles(data){
    return this.http.post(this.apiUrl + 'projects/deleteProjectFiles' , { filesName : data });
  }

  addProject(data){
    return this.http.post(this.apiUrl + 'projects', data);
  }

  editDescription(data){
    return this.http.put(this.apiUrl + 'projects/editDescription/' + data.id , data);
  }
  editFiles(data, id){
    return this.http.put(this.apiUrl + 'projects/editFiles/' + id , data);
  }

  editDetails(data){
    return this.http.put(this.apiUrl + 'projects/editDetails/' + data.id , data);
  }

  downloadFiles(id){
    //return this.http.post(this.apiUrl + 'create-zip?token=' + localStorage.getItem('LoggedInUser'), zip, {responseType: 'blob' as 'json'});
    return this.http.get(this.apiUrl + 'projects/downloadAllFiles/' + id, {responseType: 'blob' as 'json'} );
  }

  downloadFile(fileName){
    return this.http.get(this.apiUrl + 'projects/downloadFile/' + fileName, {responseType: 'blob' as 'json'} );
  }

  completeProject(id, data){
    return this.http.put(this.apiUrl + 'projects/completeProject/' + id, data) ;
  }
  closeProject(id, data){
    return this.http.put(this.apiUrl + 'projects/closeProject/' + id, data) ;
  }
  reOpenProject(id, data){
    return this.http.put(this.apiUrl + 'projects/re_openProject/' + id, data) ;
  }
  assignProject(projectId, userId): any{
    return this.http.put(this.apiUrl + 'projects/assignProject/' + projectId + '/' + userId, null) ;
  }
  
  reportReasons():any {
    return this.http.get(this.apiUrl + 'reportReasons/getProjectReportReasons') ;
  }
  report(data):any {
    return this.http.post(this.apiUrl + 'projects/reportProject', data) ;
  }
  

}
