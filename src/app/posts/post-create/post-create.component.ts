import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import { PostsService } from '../posts.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Post} from '../post.model';
import {mimeType} from './mime-type.validator';
import {Subscription} from 'rxjs';
import {GroupsService} from '../../groups/groups.service';
import {EventsService} from '../../events/events.service';
import {Group} from '../../groups/group.model';
import {Events} from '../../events/event.model';


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  groups: Group[] = [];
  events: Events[] = [];
  private groupsSub: Subscription;
  private eventsSub: Subscription;

  private mode = 'create';
  private postId: string;
  post: Post;
  categories = ['General', localStorage.getItem('department')];

  constructor(public postsService: PostsService, public route: ActivatedRoute,
              private groupsService: GroupsService, private eventsService: EventsService) {}

  ngOnInit() {
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
      title : new FormControl(null, {
        validators : [Validators.required, Validators.minLength(3)]
      }),
      content : new FormControl(null, {
        validators : [Validators.required]
       }),
      image: new FormControl(null, {
        asyncValidators: [mimeType]
      }),
      cname: new FormControl(null, {
        validators: [Validators.required]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId)
          .subscribe(postData => {
            this.isLoading = false;
            // @ts-ignore
            this.post = {
              id: postData._id,
              title: postData.title,
              content: postData.content,
              username: postData.username,
              category: postData.category,
              creator: postData.creator,
              imagePath: postData.imagePath,
            };
            this.form.setValue({
              'title': this.post.title,
              'content': this.post.content,
              'image': this.post.imagePath
            });
          });
      } else {
        this.mode = 'create';
        this.postId = null;
      }

    });
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
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value.image,
        this.form.value.cname);
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image);
    }

    this.form.reset();
  }
}
