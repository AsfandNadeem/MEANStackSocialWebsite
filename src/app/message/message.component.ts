import {AfterViewInit, Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {MessageService} from '../message.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {BehaviorSubject, Subscription} from 'rxjs';
import io from 'socket.io-client';
import {Group} from '../groups/group.model';
import {Events} from '../events/event.model';
import {Notification} from '../posts/post-list/post-list.component';
import {PostsService} from '../posts/posts.service';
import {GroupsService} from '../groups/groups.service';
import {EventsService} from '../events/events.service';
import * as moment from 'moment';
import {MatDrawer} from '@angular/material';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit, AfterViewInit {

  messagesArray = [];
  receiverId: string;
  user: any;
  message: string;
  private authStatusSub: Subscription;
  userId: string;
  receivername = 'abbas';
  userIsAuthenticated = false;
  socket: any;
  typingMessage;
  // abc = '#init';
  typing = false;

  constructor(private authService: AuthService,
              private messageService: MessageService,
              public route: ActivatedRoute, public postsService: PostsService,
              private groupsService: GroupsService, private eventsService: EventsService) {
    // this.socket = io('https://comsatsconnectbackend.herokuapp.com');
    this.socket = io('http://localhost:3000');
    }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
   // this.abc = decodeURIComponent(this.abc);
   //  this.abc = encodeURIComponent(this.abc);
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('userId')) {
        this.receiverId = paramMap.get('userId');
        console.log(this.receiverId);
        this.GetAllMessages(this.receiverId);

      }
    });
    this.socket.on('refreshpage', () => {
      console.log('socket done');
      this.route.paramMap.subscribe((paramMap: ParamMap) => {
        if (paramMap.has('userId')) {
          this.receiverId = paramMap.get('userId');
          console.log(this.receiverId);
          this.GetAllMessages(this.receiverId);

        }
      });
      this.GetAllMessages(this.receiverId);
    });

    this.socket.on('is_typing', data => {
      if (data.sender === this.receiverId) {
        this.typing = true;
      }

    });

    this.socket.on('has_stopped_typing', data => {
      if (data.sender === this.receiverId) {
        this.typing = false;
      }

    });
  }



  ngAfterViewInit() {
    const params = {
      room1: this.userId,
      room2: this.receiverId,
    };

    this.socket.emit('join chat', params);
  }

  IsTyping() {
console.log('Typing a message');
this.socket.emit('start_typing', {
  sender: this.userId,
  receiver: this.receiverId
});

if (this.typingMessage) {
  clearTimeout(this.typingMessage);
}
this.typingMessage = setTimeout(() => {
this.socket.emit('stop_typing', {
  sender: this.userId,
  receiver: this.receiverId
});
}, 500);
  }

  SendMessage() {
    if (this.message === '') {
      return;
    }
    this.messageService.SendMessage(this.userId, this.receiverId, this.receivername, this.message)
      .subscribe(data => {
        console.log(data);
        this.socket.emit('refresh', {});
        this.message = '';
      });
  }

  GetAllMessages(recevierId) {
    this.userId = this.authService.getUserId();
this.messageService.GetAllMessage(this.userId, recevierId)
  .subscribe(data => {
this.messagesArray = data.messages.message;
console.log(this.messagesArray);

this.receivername = data.usernamechat;
console.log(this.receivername);
  });
  }
}
