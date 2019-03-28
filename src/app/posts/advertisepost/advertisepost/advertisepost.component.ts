import {Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {BehaviorSubject, Subscription} from 'rxjs';

import {PostsService} from '../../posts.service';
import {Post} from '../../post.model';
import {mimeType} from './mime-type.validator';
import {Group} from '../../../groups/group.model';
import {Events} from '../../../events/event.model';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-advertisepost',
  templateUrl: './advertisepost.component.html',
  styleUrls: ['./advertisepost.component.css']
})
export class AdvertisepostComponent implements OnInit {
  screenWidth: number;
  private screenWidth$ = new BehaviorSubject<number>(window.innerWidth);
  socketHost: any;
  socket: any;
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
  constructor(public postsService: PostsService, public route: ActivatedRoute) { }

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
      }),
      cname: new FormControl(null, {
        validators: [Validators.required]
      })
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
         this.postsService.addAdvertisementPost(this.form.value.title, this.form.value.content, this.form.value.image,
        'General');
    this.form.reset();
  }

}
