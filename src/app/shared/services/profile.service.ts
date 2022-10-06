import { TokenService } from './token.service';
import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { BehaviorSubject, Observable } from 'rxjs';
import { pluginService } from 'chart.js';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  apiUrl = environment.apiUrl;

  profilePicture = new BehaviorSubject(null);
  newProfilePicture = this.profilePicture.asObservable();
  
  constructor(
    private http: HttpClient,
    private tokenS: TokenService
  ) { }


  idFromSlug(slug){
    return this.http.get(this.apiUrl + 'users/getIdFromSlug/'+ slug );
  }
  about(id, increament?): any {
    if(increament) increament = '/increament';
    else increament = '';
    return this.http.get(this.apiUrl + 'users/aboutUser/'+ id + increament  );
  }

  deleteProfilePicture(){
    return this.http.delete(this.apiUrl + 'users/deleteProfilePicture' );
  }

  statistics(id): any {
    return this.http.get(this.apiUrl + 'users/AcountStatistiques/'+ id );
  }

  references(id, length = 9, page = 1): any {
    return this.http.get(this.apiUrl + 'references/getAllReferences/'+ id +'/'+ length + '?page=' + page );
  }

  referencesDetail(id): any {
    return this.http.get(this.apiUrl + 'references/'+ id );
  }

  addReference(data){
    return this.http.post(this.apiUrl + 'references', data);
  }

  editReference(data){
    return this.http.put(this.apiUrl + 'references/' + data.id, data);
  }

  updateProfilePicture(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('profile_picture', file);
    const req = new HttpRequest('POST', `${this.apiUrl}users/editProfilePicture`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }


  updateCVPicture(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('profile_picture', file);
    const req = new HttpRequest('POST', `${this.apiUrl}jobs/editCvProfilePicture`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }


  deleteReference(id){
    return this.http.delete(this.apiUrl + 'references/'+id);
  }

  projects(id, length = 9, page = 1): any {
    return this.http.get(this.apiUrl + 'projects/getProjects/'+ id + '/' + length + '?page=' + page);
  }

  follow(id): any {
    return this.http.post(this.apiUrl + 'favoriteProfiles/addFavoriteProfile/'+ id, {followed_id : id} );
  }

  like(id): any {
    return this.http.post(this.apiUrl + 'users/likeProfile/'+ id, {followed_id : id} );
  }

  rate(id, length = 9, page = 1): any {
    return this.http.get(this.apiUrl + 'projects/getEvaluations/'+ id + '/' + length + '?page=' + page);
  }

  update(data){
    return this.http.put(this.apiUrl + 'users/editPersonalInfos', data);
  }

  allUsers(){
    return this.http.get(this.apiUrl + 'users');
  }

  getFavoriteProfiles(length = 9, page = 1){
    return this.http.get(this.apiUrl + 'users/getMyFavoriteProfiles/' + length + '?page=' + page);
  } 

  geteducationalBackgrounds(id){
    return this.http.get(this.apiUrl + 'educationalBackgrounds/getAllEducationalBackgrounds/' + id );
  } 
  
  addEducationalBackground(data){
    return this.http.post(this.apiUrl + 'educationalBackgrounds', data);
  }

  updateEducationalBackground(data){
    return this.http.put(this.apiUrl + 'educationalBackgrounds/' + data.id , data);
  }

  deleteEducationalBackground(id){
    return this.http.delete(this.apiUrl + 'educationalBackgrounds/'+id);
  }

  editPositionEducationalBackground(data){
    return this.http.post(this.apiUrl + 'educationalBackgrounds/editPosition', data);
  }

  getEvaluations(length = 9, page = 1){
    return this.http.get(this.apiUrl + 'users/getMyEvaluations/' + length + '?page=' + page);
  } 

  askForEvaluation(email): any{
    return this.http.post(this.apiUrl + 'users/askForEvaluation', { email : email } );
  }
  evaluat(data){
    return this.http.post(this.apiUrl + 'users/evaluate', data );
  }

  getMyInvoices(data, page = 1){
    return this.http.post(this.apiUrl + 'users/getMyInvoices?page=' + page, data);
  }

  downloadInvoice(id){
    return this.http.get(this.apiUrl + 'invoices/invoice_pdf/' + id , {responseType:'arraybuffer' as 'json'} );
  }

  getMySubscription(){
    return this.http.get(this.apiUrl + 'users/getMySubscription');
  }

  getAllServiceProviders(data){
    return this.http.post(this.apiUrl + 'users/filter?page=' + data.currentPage, data);
  }

  getMyCompetences(){
    return this.http.get(this.apiUrl + 'competences/getMyCompetences');
  } 

  getAllCompetences():any{
    return this.http.get(this.apiUrl + 'competences');
  }

  addCompetances(data){
    return this.http.post(this.apiUrl + 'users/addCompetence', data); 
  }
  reportReasons():any {
    return this.http.get(this.apiUrl + 'reportReasons/getUserReportReasons') ;
  }
  report(data):any {
    return this.http.post(this.apiUrl + 'users/reportUser', data) ;
  }

  sendMessage(data){
    return this.http.post(this.apiUrl + 'users/sendEmail', data) ;
  }

  getProvinces():any {
    return this.http.get(this.apiUrl + 'provinces') ;
  }

  alreadyRated(id): any{
    return this.http.get(this.apiUrl + 'users/alreadyRated/'+id) ;
  }
  
  upgrade(data): any{
    return this.http.post(this.apiUrl + 'changeUserRole/'+data.id, data) ;
  }

  
}
