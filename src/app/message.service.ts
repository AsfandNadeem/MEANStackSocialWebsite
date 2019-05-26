import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Post} from './posts/post.model';
import {Observable} from 'rxjs';

// const BASEUURL = 'https://comsatsconnectbackend.herokuapp.com/api/chat';

const BASEUURL = 'http://localhost:3000/api/chat';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor( private http: HttpClient) { }

  SendMessage( senderId, receiverId, receiverName, message): Observable<any> {
    return this.http
      .post(`${BASEUURL}/chat-messages/${senderId}/${receiverId}`, {
        receiverId,
        receiverName,
        message
      });
  }

  GetAllMessage( senderId, receiverId): Observable<any> {
    return this.http
      .get(`${BASEUURL}/chat-messages/${senderId}/${receiverId}`);
  }
}
