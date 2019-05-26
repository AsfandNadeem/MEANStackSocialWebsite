import {Component, Input, OnInit, ViewChild, HostListener  } from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {Post} from '../../posts/post.model';
import {EventsService} from '../events.service';
import {AuthService} from '../../auth/auth.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {mimeType} from '../../posts/post-create/mime-type.validator';
import {BehaviorSubject, Subscription} from 'rxjs';
import {Group} from '../../groups/group.model';
import {Events} from '../event.model';
import io from 'socket.io-client';
import {GroupsService} from '../../groups/groups.service';
import {MatDrawer} from '@angular/material';

export interface EventMembers {
  Euser: string;
}

@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.css']
})
export class EventPageComponent implements OnInit {
  screenWidth: number;
  private screenWidth$ = new BehaviorSubject<number>(window.innerWidth);
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  socket: any;
  eventMembers: EventMembers[] = [];
  posts: Post[] = [];
  groups: Group[] = [];
  events: Events[] = [];
  userIsAuthenticated = false;
 eventcreatorid: string;
  private postsSub: Subscription;
  private authStatusSub: Subscription;
  @Input() eventid: string;
  private username: string;
   eventname: string;
  eventdate: Date;
   eventdescription: string;
   eventcreator: string;
  private groupsSub: Subscription;
  private eventsSub: Subscription;
  userId: string;
  @ViewChild('mat-drawer') sidenav: MatDrawer;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenWidth$.next(event.target.innerWidth);
  }
  constructor(public eventService: EventsService, public groupsService: GroupsService,
              private authService: AuthService, public route: ActivatedRoute) {
    // this.socket = io('https://comsatsconnectbackend.herokuapp.com');
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.screenWidth$.subscribe(width => {
      this.screenWidth = width;
    });
   this.form = new FormGroup({
      title : new FormControl(null, {
        validators : [Validators.required, Validators.minLength(3)]
      }),
      content : new FormControl(null, {
        validators : [Validators.required]
      }),
      image: new FormControl(null, {
        asyncValidators: [mimeType]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
          if (paramMap.has('eventId')) {
            this.eventid = paramMap.get('eventId');
            console.log(this.eventid);
            this.getPosts();
           }
        });

        this.isLoading = true;
        this.userId = this.authService.getUserId();
        // this.username = this.authService.getName();
        this.postsSub = this.eventService.getPostUpdateListener()
           .subscribe((postData: { eventcreatorid: any, eventmembers: any, eventname: any, eventdate: Date,
             description: string, eventcreator: string, posts: Post[]}) => {
            this.isLoading = false;
        //     this.totalGroups = eventData.eventCount;
            this.username = this.authService.getName();
            this.posts = postData.posts;
            this.eventMembers = postData.eventmembers;
            this.eventname = postData.eventname,
              this.eventdate = postData.eventdate,
              this.eventdescription = postData.description,
              this.eventcreator = postData.eventcreator,
              this.eventcreatorid = postData.eventcreatorid,
              console.log(this.eventname);
            console.log(this.posts);
            console.log(this.eventMembers);
          });
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

    console.log(this.eventService.getJoinedEvents());
    this.eventsSub = this.eventService.getEventUpdateListener()
      .subscribe((eventData: { events: Events[]}) => {
        this.isLoading = false;
        this.events = eventData.events;
        console.log(this.events);
      });
    this.socket.on('refreshpage', (data) => {
      this.eventService.getPosts(this.eventid);
    });
      }

      getPosts() {
        this.eventService.getPosts(this.eventid);
      }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);

  }

  onSavePost() {
    // console.log(this.form.value.title, this.form.value.content,  this.form.value.cname);
    if (this.form.invalid) {
      return;
    }
    if (this.form.value.title == null) {
      return;
    }
    this.isLoading = true;
    this.eventService.addPost(this.eventid, this.form.value.title,
    this.form.value.content, this.form.value.image).subscribe( () => {
      this.socket.emit('refresh', {});
      this.eventService.getPosts(this.eventid);
    });
    this.form.reset();
  }

  likePost(postid: string) {
    console.log(postid + ' ' + this.eventid);
    this.eventService.likePost(postid, this.eventid).subscribe( () => {
      this.socket.emit('refresh', {});
      this.eventService.getPosts(this.eventid);
    });
  }

  dislikePost(postid: string) {
    console.log(postid + ' ' + this.eventid);
    this.eventService.dislikePost(postid, this.eventid).subscribe( () => {
      this.socket.emit('refresh', {});
      this.eventService.getPosts(this.eventid);
    });
  }

  addComment(post: Post, form: NgForm) {
    console.log(post.id + '\n' + form.value.comment + '\n' + this.eventid );
    if (form.invalid) {
      return;
    } else {
      this.eventService.addComment(post.id, this.eventid, form.value.comment).subscribe(() => {
        const a = this.posts.indexOf(post);
        this.posts[a].commentsNo++;
        this.posts[a].comments.push({comment: form.value.comment, commentator: this.username});
      });
    }
  }

  onEditEvent(form: NgForm) {
    // name: string, description: string, eventdate: Date
    if (form.invalid) {
      return;
    }
    this.eventService.updateEvent(this.eventid, form.value.eventname, form.value.description, form.value.eventdate).
    subscribe(() => {
      this.eventService.getPosts(this.eventid);
    });
    // this.groupsService.updateGroup(
    //   this.groupid,
    //   this.groupname,
    //   this.gr,
    //   this.form.value.image);
  }

}
