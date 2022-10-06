import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  apiUrl = environment.apiUrl;
  conversationIdParam = new BehaviorSubject<string>("");
  changeVar = this.conversationIdParam.asObservable();


  notificationsParam = new BehaviorSubject<string>("");
  changeNotifications: any = this.notificationsParam.asObservable();
  
  constructor(
    private http: HttpClient
  ) { }

  getMyConversations(length, state, page): any {
    return this.http.get(this.apiUrl + 'conversations/getMyConversations/'+ length  + '/' + state + '?page=' + page );
  }

  getConversation(data): any {
    return this.http.post(this.apiUrl + 'conversations/getConversationMessages', data );
  }

  getConversationByConversationId(id, lastMessage): any {
    return this.http.get(this.apiUrl + 'conversations/getConverMessages/' + id + '/' + lastMessage );
  }

  sendMessage(data): any {
    return this.http.post(this.apiUrl + 'conversations/sendMessage', data );
  }

  newMessage(data): any {
    return this.http.post(this.apiUrl + 'conversations/newMessage/'+data.conversationId, data );
  }

  downloadFile(fileName){
    return this.http.get(this.apiUrl + 'conversations/downloadFile/' + fileName, {responseType: 'blob' as 'json'} );
  }

  archiveConversation(id): any{
    return this.http.put(this.apiUrl + 'conversations/archive/' + id, null );
  }

  favoriteConversation(id) : any{
    return this.http.put(this.apiUrl + 'conversations/favorite/' + id, null );
  }

  getProjectConversations(id): any{
    return this.http.get(this.apiUrl + 'conversations/getConversations/'+ id);
  }
  deleteConversation(id): any{
    return this.http.delete(this.apiUrl + 'conversations/'+ id);
  }
  pinConversation(id): any{
    return this.http.put(this.apiUrl + 'conversations/pinConversation/'+ id, null);
  }
  compareIds(data): any{
    return this.http.post(this.apiUrl + 'conversations/compareIds', data);
  }
  getNotifications(): any{
    return this.http.get(this.apiUrl + 'conversations/getNbrConversations')
  }

}
