import { Component, OnInit, OnDestroy, ViewChild, HostListener  } from '@angular/core';
import {PageEvent} from '@angular/material';
import {BehaviorSubject, Subscription} from 'rxjs';
// import {MatSidenav} from '@angular/material';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import {AuthService} from '../../auth/auth.service';
import {GroupsService} from '../../groups/groups.service';
import {Group} from '../../groups/group.model';
import {Events} from '../../events/event.model';
import {EventsService} from '../../events/events.service';
import io from 'socket.io-client';
import * as moment from 'moment';
import {MatDrawer} from '@angular/material';
import {NgForm} from '@angular/forms';
export interface Notification {
  created: Date;
  sendername: string;
  message: string;
  senderimage: string;
}
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  screenWidth: number;
  private screenWidth$ = new BehaviorSubject<number>(window.innerWidth);
  socketHost: any;
  socket: any;
  notifications: Notification[] = [];
  posts: Post[] = [];
  groups: Group[] = [];
  events: Events[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 5;
  currentPage = 1;
  username: string;
  userId: string;
  profileimg: string;
  newComment = [];
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  private postsSub: Subscription;
  private groupsSub: Subscription;
  private eventsSub: Subscription;
  private authStatusSub: Subscription;
  private notificationSub: Subscription;

  @ViewChild('mat-drawer') sidenav: MatDrawer;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenWidth$.next(event.target.innerWidth);
  }

  constructor(public postsService: PostsService, private authService: AuthService,
              private groupsService: GroupsService, private eventsService: EventsService) {
    // this.socket = io('https://comsatsconnectbackend.herokuapp.com');
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.screenWidth$.subscribe(width => {
      this.screenWidth = width;
    });
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage );
     this.userId = this.authService.getUserId();
    // this.username = this.authService.getName();
     console.log( 'profileimg' + localStorage.getItem('profileimg'));
     this.profileimg = localStorage.getItem('profileimg');
    // const profileimg1 = localStorage.getItem('profileimg');
    // // @ts-ignore
    // this.profileimg = profileimg1.toString('base64');
    this.username =  localStorage.getItem('username');
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postData: { posts: Post[], postCount: number}) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        // this.username = this.authService.getName();
        this.posts = postData.posts;
        console.log(this.posts);
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
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
        this.isLoading = false;
        this.groups = groupData.groups;
        console.log(this.groups);
      });

    console.log(this.eventsService.getJoinedEvents());
    this.eventsSub = this.eventsService.getEventUpdateListener()
      .subscribe((eventData: { events: Events[]}) => {
        this.isLoading = false;
        this.events = eventData.events;
        console.log(this.events);
      });

    this.socket.on('refreshpage', (data) => {
      this.postsService.getNotifications();
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
      // this.groupsService.getJoinedGroups();
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onDelete(postId: string) {
    this.isLoading = true;
 this.postsService.deletePost(postId).subscribe(() => {
   this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  TimeFromNow(time) {
    return moment(time).fromNow();
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage );
    document.querySelector('#container').scrollIntoView();
  }

  likePost(id: string) {
    this.postsService.likePost(id).subscribe( () => {
      this.socket.emit('refresh', {});
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
    }


  addComment(post: Post, form: NgForm) {
    console.log(post.id + '\n' + form.value.comment);
    if (form.invalid) {
      return;
    } else {
      this.postsService.addComment(post.id, form.value.comment).subscribe(() => {
        const a = this.posts.indexOf(post);
        this.posts[a].commentsNo++;
        this.posts[a].comments.push({comment: form.value.comment, commentator: this.username});
        // this.socket.emit('refresh', {});
      // this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  }

  addReport(form: NgForm, title: string, content: string, username: string,
            creatorid: string, postid: string) {
    console.log(title + '\n' + content + '\n' + username + '\n' + creatorid
      + '\n' + postid + '\n' + form.value.reason);
    if (form.invalid) {
      return;
    } else {
      this.postsService.reportPost(title, content,
        username, creatorid, postid, form.value.reason).subscribe(() => {
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
      });
    }

  }
  onArchive(id: string) {
    console.log(id);
    this.postsService.archivepost(id).subscribe( () => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  dislikePost(id: string) {
    this.postsService.dislikePost(id).subscribe( () => {
      this.socket.emit('refresh', {});
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });

  }
}
