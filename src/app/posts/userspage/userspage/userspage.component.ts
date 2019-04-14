import {Component, Input, OnInit, ViewChild, HostListener  } from '@angular/core';
import {Post} from '../../post.model';
import {BehaviorSubject, Subscription} from 'rxjs';
import {AuthService} from '../../../auth/auth.service';
import {MatDrawer, PageEvent} from '@angular/material';

import {Group} from '../../../groups/group.model';
import {PostsService} from '../../posts.service';
import {GroupsService} from '../../../groups/groups.service';
import {Events} from '../../../events/event.model';
import {EventsService} from '../../../events/events.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-userspage',
  templateUrl: './userspage.component.html',
  styleUrls: ['./userspage.component.css']
})
export class UserspageComponent implements OnInit {
  screenWidth: number;
  private screenWidth$ = new BehaviorSubject<number>(window.innerWidth);
  friendsList = ['Shahid Mehmood', 'Moiz Khalid', 'Zara Khan', 'Ehtesham', 'Mahad Amir'];
  posts: Post[] = [];
  groups: Group[] = [];
  events: Events[] = [];
  isLoading = false;
  friends = [];
  requests = [];
  totalPosts = 0;
  usern: string;
  postsPerPage = 5;
  currentPage = 1;
  username: string;
  userId: string;
  ownid: string;
  @Input() userid: string;
  profileimg: string;
  newComment = [];
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  private postsSub: Subscription;
  private groupsSub: Subscription;
  private eventsSub: Subscription;
  private authStatusSub: Subscription;


  @ViewChild('mat-drawer') sidenav: MatDrawer;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenWidth$.next(event.target.innerWidth);
  }
  constructor(public postsService: PostsService, private authService: AuthService,
              private groupsService: GroupsService, private eventsService: EventsService,
              public route: ActivatedRoute) { }

  ngOnInit() {
    this.screenWidth$.subscribe(width => {
      this.screenWidth = width;
    });
    this.isLoading = true;

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('userId')) {
        this.userid = paramMap.get('userId');
        console.log(this.userid);
        this.getPosts();
      }
    });
    this.postsService.getuserPosts(this.userid);
    this.ownid = this.authService.getUserId();
    // this.username = this.authService.getName();
    console.log(localStorage.getItem('profileimg'));
    this.profileimg = localStorage.getItem('profileimg');
    this.username =  localStorage.getItem('username');
    this.postsSub = this.postsService.getuserPostUpdateListener()
      .subscribe((postData: { posts: Post[], usern: string, friends: any, requests: any, postCount: number}) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        // this.username = this.authService.getName();
        this.usern = postData.usern,
        this.posts = postData.posts;
        this.friends = postData.friends;
        this.requests = postData.requests;
        console.log(this.posts);
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.ownid = this.authService.getUserId();
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
  }

  // onChangedPage(pageData: PageEvent) {
  //   this.isLoading = true;
  //   this.currentPage = pageData.pageIndex + 1;
  //   this.postsPerPage = pageData.pageSize;
  //   this.postsService.getPosts(this.postsPerPage, this.currentPage );
  // }

  likePost(id: string) {
    this.postsService.likePost(id).subscribe( () => {
      this.postsService.getuserPosts(this.userid);
    });
  }

  getPosts() {
    this.postsService.getuserPosts(this.userid);
  }
  // console.log(this.posts.indexOf(post));
  // this.posts[this.posts.indexOf(post)].likes++;
  // if (this.posts[this.posts.indexOf(post)].dislikes === 0 ) {
  //
  //         } else {
  //   this.posts[this.posts.indexOf(post)].dislikes--;
  // }
  // });
  addComment(post: Post, form: NgForm) {
    console.log(post.id + '\n' + form.value.comment);
    if (form.invalid) {
      return;
    } else {
      this.postsService.addComment(post.id, form.value.comment).subscribe(() => {
        const a = this.posts.indexOf(post);
        this.posts[a].commentsNo++;
        this.posts[a].comments.push({comment: form.value.comment, commentator: this.username});
        //   this.socket.emit('refresh', {});
        // this.postsService.getPosts(this.postsPerPage, this.currentPage);
      });
    }

  }


  dislikePost(id: string) {
    this.postsService.dislikePost(id).subscribe( () => {
      this.postsService.getuserPosts(this.userid);
    });

  }
  addFriend(userID: string) {
    this.authService.requestFriend(userID).subscribe(() => {
      this.postsService.getuserPosts(this.userid);
    });
  }



}
