import {Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDrawer, PageEvent} from '@angular/material';
import {BehaviorSubject, Subscription} from 'rxjs';

import { Events } from '../event.model';
import { EventsService } from '../events.service';
import {AuthService} from '../../auth/auth.service';
import {GroupsService} from '../../groups/groups.service';
import {Group} from '../../groups/group.model';


@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit, OnDestroy {
  screenWidth: number;
  private screenWidth$ = new BehaviorSubject<number>(window.innerWidth);
  events: Events[] = [];
  groupsjoined: Group[] = [];
   isLoading = false;
   totalEvents = 0;
   eventsPerPage = 5;
   currentPage = 1;
   username: string;
   userId: string;
   // newComment = [];
   pageSizeOptions = [1, 2, 5, 10];
   userIsAuthenticated = false;
   private eventsSub: Subscription;
  private groupsSub: Subscription;
   private authStatusSub: Subscription;
  @ViewChild('mat-drawer') sidenav: MatDrawer;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenWidth$.next(event.target.innerWidth);
  }
   constructor(public eventsService: EventsService, private authService: AuthService,
               private groupsService: GroupsService) {}

   ngOnInit() {
     this.screenWidth$.subscribe(width => {
       this.screenWidth = width;
     });
     this.isLoading = true;
     this.eventsService.getEvents(this.eventsPerPage, this.currentPage );
     this.userId = this.authService.getUserId();
     this.username = this.authService.getName();
     this.eventsSub = this.eventsService.getEventUpdateListener()
       .subscribe((eventData: { events: Events[], eventCount: number}) => {
         this.isLoading = false;
         this.totalEvents = eventData.eventCount;
         this.username = this.authService.getName();
         this.events = eventData.events;
         console.log(this.events);
       });
     this.userIsAuthenticated = this.authService.getIsAuth();
     this.authStatusSub = this.authService
       .getAuthStatusListener()
       .subscribe(isAuthenticated => {
         this.userIsAuthenticated = isAuthenticated;
         this.userId = this.authService.getUserId();
       });

     console.log(this.groupsService.getJoinedGroups());
     this.groupsSub = this.groupsService.getGroupUpdateListener()
       .subscribe((groupData: { groups: Group[]}) => {
         this.isLoading = false;
         this.groupsjoined = groupData.groups;
         console.log(this.groupsjoined);
       });
   }

   ngOnDestroy() {
     this.eventsSub.unsubscribe();
     this.authStatusSub.unsubscribe();
   }
  //
  //  onDelete(postId: string) {
  //    this.isLoading = true;
  // this.postsService.deletePost(postId).subscribe(() => {
  //   this.postsService.getPosts(this.postsPerPage, this.currentPage);
  //    });
  //  }
  //

   onChangedPage(pageData: PageEvent) {
     this.isLoading = true;
     this.currentPage = pageData.pageIndex + 1;
     this.eventsPerPage = pageData.pageSize;
     this.eventsService.getEvents(this.eventsPerPage, this.currentPage );

   }

   onJoin(id: string) {
     this.eventsService.joinEvent(id);
   }


}
