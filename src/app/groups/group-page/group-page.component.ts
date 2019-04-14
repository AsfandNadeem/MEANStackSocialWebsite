import {Component, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {Post} from '../../posts/post.model';
import {GroupsService} from '../groups.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {AuthService} from '../../auth/auth.service';
import {mimeType} from '../../posts/post-create/mime-type.validator';
import {BehaviorSubject, Subscription} from 'rxjs';
import {Group} from '../group.model';
import {Events} from '../../events/event.model';
import {EventsService} from '../../events/events.service';
import io from 'socket.io-client';
import {EventMembers} from '../../events/event-page/event-page.component';
import {MatDrawer} from '@angular/material';

export interface GroupMembers {
  Guser: string;
}
export interface GroupRequests {
  Guser: string;
  Guserid: string;
}
@Component({
  selector: 'app-group-page',
  templateUrl: './group-page.component.html',
  styleUrls: ['./group-page.component.css']
})
export class GroupPageComponent implements OnInit {

  panelOpenState: boolean;
  screenWidth: number;
  private screenWidth$ = new BehaviorSubject<number>(window.innerWidth);
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  socket: any;
 groupMembers: GroupMembers[] = [];
  groupRequests: GroupRequests[] = [];
  posts: Post[] = [];
  groups: Group[] = [];
  events: Events[] = [];
  @Input() groupid: string;
  groupname: string;
  // eventdate: Date;
  groupdescription: string;
  groupcreator: string;
  groupcreatorid: string;
  userIsAuthenticated = false;
  private postsSub: Subscription;
  private authStatusSub: Subscription;
  private groupsSub: Subscription;
  private eventsSub: Subscription;
  private username: string;
   userId: string;
  @ViewChild('mat-drawer') sidenav: MatDrawer;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenWidth$.next(event.target.innerWidth);
  }

  constructor(public groupsService: GroupsService, private eventsService: EventsService,
              private authService: AuthService, public route: ActivatedRoute) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.panelOpenState = false;
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
       .subscribe((postData: { groupcreatorid: any, groupmembers: any, groupname: any,
         description: string, groupcreator: string, grouprequests: any, posts: Post[]}) => {
        this.isLoading = false;
    //     this.totalGroups = groupData.groupCount;
        this.username = this.authService.getName();
        this.posts = postData.posts;
         this.groupMembers = postData.groupmembers;
         this.groupRequests = postData.grouprequests;
         this.groupname = postData.groupname,
           this.groupcreatorid = postData.groupcreatorid,
           // this.eventdate = postData.eventdate,
           this.groupdescription = postData.description,
           this.groupcreator = postData.groupcreator,
         console.log(this.posts);
         console.log(this.groupMembers);
         console.log(this.groupRequests);
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });

    // console.log(this.groupsService.getJoinedGroups());
    // this.groupsSub = this.groupsService.getGroupUpdateListener()
    //   .subscribe((groupData: { groups: Group[]}) => {
    //     this.isLoading = false;
    //     this.groups = groupData.groups;
    //     console.log(this.groups);
    //   });
    //
    // console.log(this.eventsService.getJoinedEvents());
    // this.eventsSub = this.eventsService.getEventUpdateListener()
    //   .subscribe((eventData: { events: Events[]}) => {
    //     this.isLoading = false;
    //     this.events = eventData.events;
    //     console.log(this.events);
    //   });
    this.socket.on('refreshpage', (data) => {
      this.groupsService.getPosts(this.groupid);
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
        this.socket.emit('refresh', {});
        this.groupsService.getPosts(this.groupid);
      });
    this.form.reset();
  }

  likePost(postid: string) {
    console.log(postid + ' ' + this.groupid);
    this.groupsService.likePost(postid, this.groupid).subscribe( () => {
      this.socket.emit('refresh', {});
      this.groupsService.getPosts(this.groupid);
    });
  }

  dislikePost(postid: string) {
    console.log(postid + ' ' + this.groupid);
    this.groupsService.dislikePost(postid, this.groupid).subscribe( () => {
      this.socket.emit('refresh', {});
      this.groupsService.getPosts(this.groupid);
    });
  }

  addComment(post: Post, form: NgForm) {
    console.log(post.id + '\n' + form.value.comment + '\n' + this.groupid );
    if (form.invalid) {
      return;
    } else {
      this.groupsService.addComment(post.id, this.groupid, form.value.comment).subscribe(() => {
        const a = this.posts.indexOf(post);
              this.posts[a].commentsNo++;
              this.posts[a].comments.push({comment: form.value.comment, commentator: this.username});
      });
    }
}

  // addComment(post: Post, form: NgForm) {
  //   console.log(post.id + '\n' + form.value.comment);
  //   if (form.invalid) {
  //     return;
  //   } else {
  //     this.postsService.addComment(post.id, form.value.comment).subscribe(() => {
  //       const a = this.posts.indexOf(post);
  //       this.posts[a].commentsNo++;
  //       this.posts[a].comments.push({comment: form.value.comment, commentator: this.username});
  //       //   this.socket.emit('refresh', {});
  //       // this.postsService.getPosts(this.postsPerPage, this.currentPage);
  //     });
  //   }
  //
  // }

  acceptRequest(id: string) {
    console.log(id);
    this.groupsService.joinGroup(id, this.groupid).subscribe( () => {
      this.socket.emit('refresh', {});
      this.groupsService.getPosts(this.groupid);
    });
  }

  leaveGroup(id: string) {
    console.log(id);
    this.groupsService.leaveGroup(id, this.groupid);
  }
  onEditGroup(form: NgForm) {
     // name: string, description: string, eventdate: Date
     if (form.invalid) {
       return;
     }
     this.panelOpenState = false;
    this.groupsService.updateGroup(this.groupid, form.value.groupname, form.value.description).
      subscribe(() => {
      this.groupsService.getPosts(this.groupid);
    });
    // this.groupsService.updateGroup(
    //   this.groupid,
    //   this.groupname,
    //   this.gr,
    //   this.form.value.image);
  }



}
