import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Post} from '../../posts/post.model';
import {GroupsService} from '../groups.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {AuthService} from '../../auth/auth.service';
import {mimeType} from '../../posts/post-create/mime-type.validator';
import {Subscription} from 'rxjs';
import {Group} from '../group.model';
import {Events} from '../../events/event.model';
import {EventsService} from '../../events/events.service';
import {EventMembers} from '../../events/event-page/event-page.component';

export interface GroupMembers {
  Guser: string;
}
@Component({
  selector: 'app-group-page',
  templateUrl: './group-page.component.html',
  styleUrls: ['./group-page.component.css']
})
export class GroupPageComponent implements OnInit {

  isLoading = false;
  form: FormGroup;
  imagePreview: string;

 groupMembers: GroupMembers[] = [];
  posts: Post[] = [];
  groups: Group[] = [];
  events: Events[] = [];
  @Input() groupid: string;
  userIsAuthenticated = false;
  private postsSub: Subscription;
  private authStatusSub: Subscription;
  private groupsSub: Subscription;
  private eventsSub: Subscription;
  private username: string;
  private userId: string;

  constructor(public groupsService: GroupsService, private eventsService: EventsService,
              private authService: AuthService, public route: ActivatedRoute) { }

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
      if (paramMap.has('groupId')) {
        this.groupid = paramMap.get('groupId');
        console.log(this.groupid);
        this.getPosts();
       }
    });

    this.isLoading = true;
    this.userId = this.authService.getUserId();
    // this.username = this.authService.getName();
    this.postsSub = this.groupsService.getPostUpdateListener()
       .subscribe((postData: { groupmembers: any, posts: Post[]}) => {
        this.isLoading = false;
    //     this.totalGroups = groupData.groupCount;
        this.username = this.authService.getName();
        this.posts = postData.posts;
         this.groupMembers = postData.groupmembers;
         console.log(this.posts);
         console.log(this.groupMembers);
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

    console.log(this.eventsService.getJoinedEvents());
    this.eventsSub = this.eventsService.getEventUpdateListener()
      .subscribe((eventData: { events: Events[]}) => {
        this.isLoading = false;
        this.events = eventData.events;
        console.log(this.events);
      });
  }

  getPosts() {
    this.groupsService.getPosts(this.groupid);
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
  onDelete(postId: string) {
    this.isLoading = true;
    this.groupsService.deletePost(this.groupid, postId).subscribe(() => {
      this.groupsService.getPosts(this.groupid);
    });
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
      this.groupsService.addPost(this.groupid, this.form.value.title,
        this.form.value.content, this.form.value.image).subscribe( () => {
        this.groupsService.getPosts(this.groupid);
      });
    this.form.reset();
  }

  likePost(postid: string) {
    console.log(postid + ' ' + this.groupid);
    this.groupsService.likePost(postid, this.groupid).subscribe( () => {
      this.groupsService.getPosts(this.groupid);
    });
  }

  dislikePost(postid: string) {
    console.log(postid + ' ' + this.groupid);
    this.groupsService.dislikePost(postid, this.groupid).subscribe( () => {
      this.groupsService.getPosts(this.groupid);
    });
  }

  addComment(postid: string, comment: string) {
    console.log(postid + '\n' + comment + '\n' + this.groupid );
    if (comment === '') {
      return;
    } else {
      this.groupsService.addComment(postid, this.groupid, comment).subscribe(() => {
        this.groupsService.getPosts(this.groupid);
      });
    }
}

}
