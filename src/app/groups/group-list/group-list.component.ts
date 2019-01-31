import {Component, OnDestroy, OnInit} from '@angular/core';
import {PageEvent} from '@angular/material';
import { Subscription } from 'rxjs';

import { Group } from '../group.model';
import { GroupsService } from '../groups.service';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css']
})
export class GroupListComponent implements OnInit, OnDestroy {

  groups: Group[] = [];
   isLoading = false;
   totalGroups = 0;
   groupsPerPage = 5;
   currentPage = 1;
   username: string;
   userId: string;
   // newComment = [];
   pageSizeOptions = [1, 2, 5, 10];
   userIsAuthenticated = false;
   private groupsSub: Subscription;
   private authStatusSub: Subscription;

   constructor(public groupsService: GroupsService, private authService: AuthService) {}

   ngOnInit() {
     this.isLoading = true;
     this.groupsService.getGroups(this.groupsPerPage, this.currentPage );
     this.userId = this.authService.getUserId();
     this.username = this.authService.getName();
     this.groupsSub = this.groupsService.getGroupUpdateListener()
       .subscribe((groupData: { groups: Group[], groupCount: number}) => {
         this.isLoading = false;
         this.totalGroups = groupData.groupCount;
         this.username = this.authService.getName();
         this.groups = groupData.groups;
         console.log(this.groups);
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
     this.groupsSub.unsubscribe();
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
     this.groupsPerPage = pageData.pageSize;
     this.groupsService.getGroups(this.groupsPerPage, this.currentPage );
   }

  //  likePost(id: string) {
  //    this.postsService.likePost(id).subscribe( () => {
  //      this.postsService.getPosts(this.postsPerPage, this.currentPage);
  //    });
  //
  //  }
  //
  //  addComment(id: string, comment: string) {
  //    console.log(id + '\n' + comment);
  //    if (comment === '') {
  //      return;
  //    } else {
  //    this.postsService.addComment(id, comment).subscribe(() => {
  //      this.postsService.getPosts(this.postsPerPage, this.currentPage);
  //    });
  //  }
  //
  //  }
  //
  //  dislikePost(id: string) {
  //    this.postsService.dislikePost(id).subscribe( () => {
  //      this.postsService.getPosts(this.postsPerPage, this.currentPage);
  //    });
  //
  //  }

}
