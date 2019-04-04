import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Post} from '../../../../posts/post.model';
import {Subscription} from 'rxjs';
import {mimeType} from '../../../../posts/post-create/mime-type.validator';
import {ParamMap, Router} from '@angular/router';
import {AuthService} from '../../../auth.service';
import {PostsService} from '../../../../posts/posts.service';
export interface Advertisement {
  id: string;
  title: string;
  content: string;
  imagePath: string;
  username: string;
  createdAt: Date;
  adcreator: string;
  approved: boolean;
}
@Component({
  selector: 'app-advertiserpage',
  templateUrl: './advertiserpage.component.html',
  styleUrls: ['./advertiserpage.component.css']
})
export class AdvertiserpageComponent implements OnInit {
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  advertisements: Advertisement[] = [];
  // eventdate: Date;
  advertisername: string;
  // userIsAuthenticated = false;
  private advertisementsSub: Subscription;
  // private authStatusSub: Subscription;
   private advertiserId: string;
  constructor(public authService: AuthService, private postsService: PostsService, private router: Router) { }

  ngOnInit() {
    if (!this.authService.getIsAdvertiserAuth()) {
      this.router.navigate(['/advertise']);
    } else {
      this.form = new FormGroup({
        title: new FormControl(null, {
          validators: [Validators.required, Validators.minLength(3)]
        }),
        content: new FormControl(null, {
          validators: [Validators.required]
        }),
        image: new FormControl(null, {
          asyncValidators: [mimeType]
        })
      });
      this.isLoading = false;
      this.advertisername = this.authService.getadvertisername();
      this.advertiserId = this.authService.getadvertiserid();
      this.getPosts();
      this.advertisementsSub = this.postsService.getadvertisementPostUpdateListener()
        .subscribe((postData: { advertisements: Advertisement[], advertisementCount: number }) => {
          this.isLoading = false;
          this.advertisements = postData.advertisements;
          console.log(this.advertisements);
        });
    }
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
    this.postsService.addAdvertisement(this.advertiserId, this.advertisername, this.form.value.title,
      this.form.value.content, this.form.value.image).subscribe( () => {
        this.postsService.getadvertiserPosts(this.advertiserId);
      console.log('postadded');
    });
    this.form.reset();
  }
  logout() {
    this.advertisername = null;
    this.advertiserId = null;
    this.advertisements = null;
    this.advertisementsSub.unsubscribe();
    this.authService.advertiserlogout();
  }

  getPosts() {
    this.postsService.getadvertiserPosts(this.advertiserId);
  }

}
