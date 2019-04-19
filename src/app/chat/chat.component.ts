import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {MessageService} from '../message.service';
import {ActivatedRoute} from '@angular/router';
import {PostsService} from '../posts/posts.service';
import {GroupsService} from '../groups/groups.service';
import {EventsService} from '../events/events.service';
import {Notification} from '../posts/post-list/post-list.component';
import {Group} from '../groups/group.model';
import {Events} from '../events/event.model';
import * as moment from 'moment';
import {BehaviorSubject, Subscription} from 'rxjs';
import {MatDrawer} from '@angular/material';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  screenWidth: number;
  private screenWidth$ = new BehaviorSubject<number>(window.innerWidth);
  notifications: Notification[] = [];
  // posts: Post[] = [];
  groups: Group[] = [];
  events: Events[] = [];
  private groupsSub: Subscription;
  private eventsSub: Subscription;
  private notificationSub: Subscription;
  @ViewChild('mat-drawer') sidenav: MatDrawer;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenWidth$.next(event.target.innerWidth);
  }
  constructor(private authService: AuthService,
              public route: ActivatedRoute, public postsService: PostsService,
              private groupsService: GroupsService, private eventsService: EventsService) { }

  ngOnInit() {
    this.screenWidth$.subscribe(width => {
      this.screenWidth = width;
    });
    this.postsService.getNotifications();
    this.notificationSub = this.postsService.getNotificationUpdateListener()
      .subscribe((notificationData: { notifications: Notification[]}) => {
        this.notifications = notificationData.notifications;
        console.log(this.notifications);
      });

    console.log(this.groupsService.getJoinedGroups());
    this.groupsSub = this.groupsService.getGroupUpdateListener()
      .subscribe((groupData: { groups: Group[]}) => {
        // this.isLoading = false;
        this.groups = groupData.groups;
        console.log(this.groups);
      });

    console.log(this.eventsService.getJoinedEvents());
    this.eventsSub = this.eventsService.getEventUpdateListener()
      .subscribe((eventData: { events: Events[]}) => {
        // this.isLoading = false;
        this.events = eventData.events;
        console.log(this.events);
      });
  }
  TimeFromNow(time) {
    return moment(time).fromNow();
  }
}
