import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../auth.service';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {mimeType} from '../../posts/post-create/mime-type.validator';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {User} from '../../auth/user.model';
import {Group} from '../../groups/group.model';
import {Events} from '../../events/event.model';
import {BehaviorSubject, Subscription} from 'rxjs';
import {GroupsService} from '../../groups/groups.service';
import {EventsService} from '../../events/events.service';
import {MatDrawer} from '@angular/material';


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
  groups: Group[] = [];
  events: Events[] = [];
  username: string;
  userId: string;
  profileimg: string;
  private groupsSub: Subscription;
  private eventsSub: Subscription;
  userIsAuthenticated = false;
  private authStatusSub: Subscription;
  user: User;
  profiles = [
    {main: 'usernmae',
    value: 'Asfand'},
    {main: 'Email',
      value: 'asfand@gmail.com'},
    {main: 'department',
      value: 'CS'},
    {main: 'REG NO',
      value: 'FA15-BCS-034'}
  ];
  @ViewChild('mat-drawer') sidenav: MatDrawer;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenWidth$.next(event.target.innerWidth);
  }

  constructor(public authService: AuthService, public route: ActivatedRoute,
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


}
