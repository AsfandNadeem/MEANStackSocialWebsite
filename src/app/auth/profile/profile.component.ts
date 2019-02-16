import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {mimeType} from '../../posts/post-create/mime-type.validator';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {User} from '../../auth/user.model';
import {Group} from '../../groups/group.model';
import {Events} from '../../events/event.model';
import {Subscription} from 'rxjs';
import {GroupsService} from '../../groups/groups.service';
import {EventsService} from '../../events/events.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  isLoading = false;
  form: FormGroup;
  private mode = 'create';
  private userId: string;
  groups: Group[] = [];
  events: Events[] = [];
  private groupsSub: Subscription;
  private eventsSub: Subscription;
  user: User;

  constructor(public authService: AuthService, public route: ActivatedRoute,
              private groupsService: GroupsService, private eventsService: EventsService) { }

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
      username : new FormControl(null, {
        validators : [Validators.required, Validators.minLength(3)]
      }),
      password : new FormControl(null, {
        validators : [Validators.required]
      })
    });
  }

  onEdit() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    console.log(this.form.value.username + '\n' + this.form.value.password + '\n' + localStorage.getItem('userId'));
    this.authService.updateUser(
        localStorage.getItem('userId'),
        this.form.value.username,
        this.form.value.password);
    this.form.reset();
  }


}
