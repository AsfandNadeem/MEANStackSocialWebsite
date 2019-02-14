import { Component, OnInit, OnDestroy } from '@angular/core';
import {PageEvent} from '@angular/material';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import {AuthService} from '../../auth/auth.service';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 5;
  currentPage = 1;
  username: string;
  userId: string;
  profileimg: string;
  newComment = [];
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  private postsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(public postsService: PostsService, private authService: AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage );
    this.userId = this.authService.getUserId();
    this.username = this.authService.getName();
     console.log(localStorage.getItem('profileimg'));
    this.profileimg = localStorage.getItem('profileimg');
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postData: { posts: Post[], postCount: number}) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
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

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onDelete(postId: string) {
    this.isLoading = true;
 this.postsService.deletePost(postId).subscribe(() => {
   this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }


  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage );
  }

  likePost(id: string) {
    this.postsService.likePost(id).subscribe( () => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
    }

      // console.log(this.posts.indexOf(post));
      // this.posts[this.posts.indexOf(post)].likes++;
      // if (this.posts[this.posts.indexOf(post)].dislikes === 0 ) {
      //
      //         } else {
      //   this.posts[this.posts.indexOf(post)].dislikes--;
      // }
      // });
  addComment(id: string, comment: string) {
    console.log(id + '\n' + comment);
    if (comment === '') {
      return;
    } else {
    this.postsService.addComment(id, comment).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  }
  onArchive(id: string) {
    console.log(id);
    this.postsService.archivepost(id).subscribe( () => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  dislikePost(id: string) {
    this.postsService.dislikePost(id).subscribe( () => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });

  }
}
