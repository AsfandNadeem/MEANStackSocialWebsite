import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import { GroupsService } from '../groups.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Group} from '../group.model';
import {Events} from '../../events/event.model';
import {Post} from '../../posts/post.model';
import {Subscription} from 'rxjs';
import {mimeType} from '../../posts/post-create/mime-type.validator';
import {EventsService} from '../../events/events.service';
// import {mimeType} from './mime-type.validator';

@Component({
  selector: 'app-group-create',
  templateUrl: './group-create.component.html',
  styleUrls: ['./group-create.component.css']
})
export class GroupCreateComponent implements OnInit {

  isLoading = false;
  form: FormGroup;
  groups: Group[] = [];
  events: Events[] = [];
  private groupsSub: Subscription;
  private eventsSub: Subscription;
  post: Post;
  categories = ['General', localStorage.getItem('department')];

  constructor(public groupService: GroupsService,
              private eventsService: EventsService, public route: ActivatedRoute) { }

  ngOnInit() {

    console.log(this.groupService.getJoinedGroups());
    this.groupsSub = this.groupService.getGroupUpdateListener()
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
      name : new FormControl(null, {
        validators : [Validators.required, Validators.minLength(3)]
      }),
      description : new FormControl(null, {
        validators : [Validators.required]
      }),
      cname: new FormControl(null, {
        validators: [Validators.required]
      })
    });
  }

  onSaveGroup() {
    // console.log(this.form.value.title, this.form.value.content,  this.form.value.cname);
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.groupService.addGroup(this.form.value.name, this.form.value.cname, this.form.value.description, localStorage.getItem('username'));
    this.form.reset();
  }

}
