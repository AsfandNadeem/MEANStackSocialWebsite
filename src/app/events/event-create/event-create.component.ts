import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import { EventsService } from '../events.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Events} from '../event.model';
import {Post} from '../../posts/post.model';
import {mimeType} from '../../posts/post-create/mime-type.validator';
import {Group} from '../../groups/group.model';
import {Subscription} from 'rxjs';
import {GroupsService} from '../../groups/groups.service';
// import {mimeType} from './mime-type.validator';
@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css']
})
export class EventCreateComponent implements OnInit {

  isLoading = false;
  form: FormGroup;
  groups: Group[] = [];
  events: Events[] = [];
  private groupsSub: Subscription;
  private eventsSub: Subscription;
  post: Post;
  categories = ['General', localStorage.getItem('department')];

  constructor(public eventService: EventsService,
              public groupService: GroupsService,
              public route: ActivatedRoute) { }

  ngOnInit() {

    console.log(this.groupService.getJoinedGroups());
    this.groupsSub = this.groupService.getGroupUpdateListener()
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

