import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Post} from '../../posts/post.model';
import {EventsService} from '../events.service';
import {AuthService} from '../../auth/auth.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {mimeType} from '../../posts/post-create/mime-type.validator';

@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.css']
})
export class EventPageComponent implements OnInit {

  isLoading = false;
  form: FormGroup;
  imagePreview: string;

  post: Post;
  @Input() eventid: string;
  constructor(public eventService: EventsService,  private authService: AuthService, public route: ActivatedRoute) { }

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
    this.eventService.addPost(this.eventid, this.form.value.title, this.form.value.content, this.form.value.image);

    this.form.reset();
  }

}