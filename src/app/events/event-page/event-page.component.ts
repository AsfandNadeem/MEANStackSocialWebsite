import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Post} from '../../posts/post.model';
import {EventsService} from '../events.service';
import {AuthService} from '../../auth/auth.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {mimeType} from '../../posts/post-create/mime-type.validator';
import {Subscription} from 'rxjs';
import {Group} from '../../groups/group.model';
import {Events} from '../event.model';
import io from 'socket.io-client';
import {GroupsService} from '../../groups/groups.service';

export interface EventMembers {
  Euser: string;
}

@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.css']
})
export class EventPageComponent implements OnInit {

  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  socket: any;
  eventMembers: EventMembers[] = [];
  posts: Post[] = [];
  groups: Group[] = [];
  events: Events[] = [];
  userIsAuthenticated = false;
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
  private userId: string;
  constructor(public eventService: EventsService, public groupsService: GroupsService,
              private authService: AuthService, public route: ActivatedRoute) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
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
           .subscribe((postData: {  eventmembers: any, eventname: any, eventdate: Date,
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

  addComment(postid: string, comment: string) {
    console.log(postid + '\n' + comment + '\n' + this.eventid );
    if (comment === '') {
      return;
    } else {
      this.eventService.addComment(postid, this.eventid, comment).subscribe(() => {
        this.socket.emit('refresh', {});
        this.eventService.getPosts(this.eventid);
      });
    }
  }

}
