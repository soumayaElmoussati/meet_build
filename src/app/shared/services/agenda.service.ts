import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {

  apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private tokenS: TokenService
  ) { }


  getCalendarOfUser(id): any{
    return this.http.get(this.apiUrl + 'agendas/getAgendas/'+ id );
  }

  addAgenda(data){
    return this.http.post(this.apiUrl + 'agendas', data);
  }

  getAgendaStatus(){
    return this.http.get(this.apiUrl + 'status');
  }

}
