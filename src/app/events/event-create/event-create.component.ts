import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import { EventsService } from '../events.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Event} from '../event.model';
import {Post} from '../../posts/post.model';
import {mimeType} from '../../posts/post-create/mime-type.validator';
// import {mimeType} from './mime-type.validator';
@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css']
})
export class EventCreateComponent implements OnInit {

  isLoading = false;
  form: FormGroup;
  // imagePreview: string;
  //
  // private mode = 'create';
  // private postId: string;
  post: Post;
  categories = ['General', localStorage.getItem('department')];

  constructor(public eventService: EventsService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.form = new FormGroup({
      name : new FormControl(null, {
        validators : [Validators.required, Validators.minLength(3)]
      }),
      description : new FormControl(null, {
        validators : [Validators.required]
      }),
      cname: new FormControl(null, {
        validators: [Validators.required]
      }),
      eventdate: new FormControl( null, {
        validators: [Validators.required]
      })
    });
  }

  onSaveEvent() {
    // console.log(this.form.value.title, this.form.value.content,  this.form.value.cname);
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.eventService.addEvent(this.form.value.name, this.form.value.cname,
      this.form.value.description, this.form.value.eventdate
      , localStorage.getItem('username'));
    this.form.reset();
  }

}

