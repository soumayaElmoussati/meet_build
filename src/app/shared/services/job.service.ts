import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class JobService {
  apiUrl = environment.apiUrl;
  dataFiltre = new BehaviorSubject(null);
  currentdataFiltre = this.dataFiltre.asObservable();
  
  constructor(
    private http: HttpClient
  ) { }

  getCategories(): any {
    return this.http.get(this.apiUrl + 'listCategories');
  }
  getSubCategories(category_id): any {
    return this.http.get(this.apiUrl + 'listCategories/getSubCategOfCateg/'+category_id);
  }

  getPaymentStatus(id): any {
    return this.http.get(this.apiUrl + 'jobs/checkPayment/' + id);
  }
  extendAd(id, coupon): any{
    const data = {
      jobId: id,
      codePromo: coupon
    }
    return this.http.post(this.apiUrl + 'jobs/renewJobSubscription', data);
  }

  getContractTypes(){
    return this.http.get(this.apiUrl + 'contractTypes');
  }
  addJob(data): any{
    return this.http.post(this.apiUrl + 'jobs', data);
  }
  getJobDetail(id):any{
    return this.http.get(this.apiUrl + 'jobs/'+id);
  }
  getAllJobs(length, page,function_name, city, category_id, order,contract_type_id, mine){
    return this.http.get(this.apiUrl + 'jobs/getAllJobs/'+ length + '/'+ function_name  + '/'+ city  + '/'+ category_id + '/' + order + '/' + contract_type_id  +'/' + mine +'?page=' + page )
  }
  getLastJobs(category_id){
    return this.http.get(this.apiUrl + 'jobs/getLastJobs'+ '/'+ category_id)
  }
  editDescription(data){
    return this.http.put(this.apiUrl + 'jobs/editDescription/' + data.id , data);
  }
  editDetails(data){
    return this.http.put(this.apiUrl + 'jobs/editDetails/' + data.id , data);
  }
  deleteJob(id){
    return this.http.delete(this.apiUrl + 'jobs/' + id);
  }
  apply(data){
    return this.http.post<any>(this.apiUrl+'jobs/applyForJob/'+data.jobId, data);
  }
  putCV(data){
    return this.http.post<any>(this.apiUrl+'jobs/putCV', data);
  }
  editCV(data){
    return this.http.put<any>(this.apiUrl+'users/editJobProfile', data);
  }
  getCV(): any{
    return this.http.get<any>(this.apiUrl+'users/getMyCv');
  }
  downloadCV(fileName){
    return this.http.get(this.apiUrl + 'users/downloadCv/' + fileName, {responseType: 'blob' as 'json'} );
  }
  getJobProfiles(search, length, page, city, category_id, order){
    return this.http.get(this.apiUrl + 'users/getJobProfiles/'+ length  + '/'+ city  + '/'+ category_id + '/' + search + '/' + order +'?page=' + page )
  }
  
  jobs(id, length = 9, page = 1): any {
      return this.http.get(this.apiUrl + 'jobs/getUserJobs/'+ id + '/' + length + '?page=' + page);
  }

  reportReasons():any {
    return this.http.get(this.apiUrl + 'reportReasons/getJobReportReasons') ;
  }
  report(data):any {
    return this.http.post(this.apiUrl + 'jobs/reportJob', data) ;
  }
}