import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {MessageService} from '../message.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  messagesArray = [];
  receiverId: string;
  user: any;
  message: string;
  private authStatusSub: Subscription;
  userId: string;
  receivername = 'abbas';
  userIsAuthenticated = false;
  constructor(private authService: AuthService,
              private messageService: MessageService,
              public route: ActivatedRoute) { }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('userId')) {
        this.receiverId = paramMap.get('userId');
        console.log(this.receiverId);
        this.GetAllMessages(this.receiverId);
      }
    });
  }


  SendMessage() {
    if (this.message === '') {
      return;
    }
    this.messageService.SendMessage(this.userId, this.receiverId, this.receivername, this.message)
      .subscribe(data => {
        console.log(data);
        this.message = '';
      });
  }
  GetAllMessages(recevierId) {
    this.userId = this.authService.getUserId();
this.messageService.GetAllMessage(this.userId, recevierId)
  .subscribe(data => {
this.messagesArray = data.messages.message;
console.log(this.messagesArray);
  });
  }
}
