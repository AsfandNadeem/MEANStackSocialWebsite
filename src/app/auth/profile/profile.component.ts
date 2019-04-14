import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../auth.service';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {User} from '../../auth/user.model';
import {Events} from '../../events/event.model';
import {BehaviorSubject, Subscription} from 'rxjs';
import {GroupsService} from '../../groups/groups.service';
import {EventsService} from '../../events/events.service';
import {MatDrawer} from '@angular/material';
import {PostsService} from '../../posts/posts.service';
import * as moment from 'moment';
export interface Request {
  username: string;
  usersrid: string;
}
export interface Friend {
  username: string;
  usersrid: string;
}
export interface Notification {
  created: Date;
  sendername: string;
  message: string;
  senderimage: string;
}
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  screenWidth: number;
  private screenWidth$ = new BehaviorSubject<number>(window.innerWidth);
  isLoading = false;
  form: FormGroup;
  private mode = 'create';
  requests: Request[] = [];
  events: Events[] = [];
  friends: Friend[] = [];
  username: string;
  userId: string;
  profileimg: string;
  private friendsSub: Subscription;
  private requestsSub: Subscription;
  private eventsSub: Subscription;
  private profilesSub: Subscription;
  userIsAuthenticated = false;
  private authStatusSub: Subscription;

  notifications: Notification[] = [];
  private notificationSub: Subscription;
  user: User;
  profiles = [
    // {main: 'usernmae',
    // value: 'Asfand'},
    // {main: 'Email',
    //   value: 'asfand@gmail.com'},
    // {main: 'department',
    //   value: 'CS'},
    // {main: 'REG NO',
    //   value: 'FA15-BCS-034'}
  ];
  @ViewChild('mat-drawer') sidenav: MatDrawer;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenWidth$.next(event.target.innerWidth);
  }

  constructor(public authService: AuthService, public postsService: PostsService, public route: ActivatedRoute,
              private groupsService: GroupsService, private eventsService: EventsService) { }

  ngOnInit() {
    this.screenWidth$.subscribe(width => {
      this.screenWidth = width;
    });
    // this.username = this.authService.getName();
    console.log( 'profileimg' + localStorage.getItem('profileimg'));
    this.profileimg = localStorage.getItem('profileimg');
    // const profileimg1 = localStorage.getItem('profileimg');
    // // @ts-ignore
    // this.profileimg = profileimg1.toString('base64');
    this.username =  localStorage.getItem('username');
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
this.authService.getProfile();
    this.profilesSub = this.authService.getProfileUpdateListener()
      .subscribe((postData: { email:  any, usernamefetched:  any,  departmentfetched:  any,  registrationofetched:  any}) => {
        this.profiles = [
          {main: 'Username:                  ',
            value: postData.usernamefetched},
          {main: 'Email:                          ',
            value: postData.email},
          {main: 'Department:               ',
            value: postData.departmentfetched},
          {main: 'REG NO:                      ',
            value: postData.registrationofetched}
        ];
      });
    console.log(this.authService.getRequestedFriends());
    this.requestsSub = this.authService.getReqeuestUpdatedListener()
      .subscribe((groupData: { requests: Request[]}) => {
        this.isLoading = false;
        this.requests = groupData.requests;
        console.log(this.requests);
      });

    console.log(this.authService.getFriends());
    this.friendsSub = this.authService.getFriendUpdatedListener()
      .subscribe((groupData: { friends: Friend[]}) => {
        this.isLoading = false;
        this.friends = groupData.friends;
        console.log(this.friends);
      });

    this.postsService.getNotifications();
    this.notificationSub = this.postsService.getNotificationUpdateListener()
      .subscribe((notificationData: { notifications: Notification[]}) => {
        this.notifications = notificationData.notifications;
        console.log(this.notifications);
      });
    this.form = new FormGroup({
      username : new FormControl(null, {
        validators : [Validators.required, Validators.minLength(3)]
      }),
      password : new FormControl(null, {
        validators : [Validators.required]
      })
    });
  }

  onEdit() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    console.log(this.form.value.username + '\n' + this.form.value.password + '\n' + localStorage.getItem('userId'));
    this.authService.updateUser(
        localStorage.getItem('userId'),
        this.form.value.username,
        this.form.value.password);
    this.form.reset();
  }
  TimeFromNow(time) {
    return moment(time).fromNow();
  }

  // addFriend(userID: string) {
  //   this.authService.requestFriend(userID).subscribe(() => {
  //     this.postsService.getuserPosts(this.userid);
  //   });
  // }
  acceptRequest(id: string) {
    console.log(id);
    this.authService.acceptrequestFriend(id).subscribe( () => {
      this.authService.getFriends();
      this.authService.getRequestedFriends();
    });
  }

}
