import {Component, OnDestroy, OnInit} from '@angular/core';
import {PageEvent} from '@angular/material';
import { Subscription } from 'rxjs';

import { Event } from '../event.model';
import { EventsService } from '../events.service';
import {AuthService} from '../../auth/auth.service';


@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit, OnDestroy {

  events: Event[] = [];
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
   private authStatusSub: Subscription;

   constructor(public eventsService: EventsService, private authService: AuthService) {}

   ngOnInit() {
     this.isLoading = true;
     this.eventsService.getEvents(this.eventsPerPage, this.currentPage );
     this.userId = this.authService.getUserId();
     this.username = this.authService.getName();
     this.eventsSub = this.eventsService.getEventUpdateListener()
       .subscribe((eventData: { events: Event[], eventCount: number}) => {
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

}
