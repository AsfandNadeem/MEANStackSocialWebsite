import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Post} from '../../posts/post.model';
import {GroupsService} from '../groups.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {AuthService} from '../../auth/auth.service';
import {mimeType} from '../../posts/post-create/mime-type.validator';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-group-page',
  templateUrl: './group-page.component.html',
  styleUrls: ['./group-page.component.css']
})
export class GroupPageComponent implements OnInit {

  isLoading = false;
  form: FormGroup;
  imagePreview: string;

  posts: Post[] = [];
  @Input() groupid: string;
  userIsAuthenticated = false;
  private postsSub: Subscription;
  private authStatusSub: Subscription;
  private username: string;
  private userId: string;

  constructor(public groupsService: GroupsService, private authService: AuthService, public route: ActivatedRoute) { }

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
       .subscribe((postData: { posts: Post[]}) => {
        this.isLoading = false;
    //     this.totalGroups = groupData.groupCount;
        this.username = this.authService.getName();
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
    this.isLoading = true;
      this.groupsService.addPost(this.groupid, this.form.value.title, this.form.value.content, this.form.value.image
        , localStorage.getItem('profileimg'));

    this.form.reset();
  }

}
