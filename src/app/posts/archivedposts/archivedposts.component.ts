import { Component, OnInit } from '@angular/core';
import {Post} from '../post.model';
import {Subscription} from 'rxjs';
import {PostsService} from '../posts.service';
import {AuthService} from '../../auth/auth.service';
import {PageEvent} from '@angular/material';

@Component({
  selector: 'app-archivedposts',
  templateUrl: './archivedposts.component.html',
  styleUrls: ['./archivedposts.component.css']
})
export class ArchivedpostsComponent implements OnInit {

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

  constructor(public postsService: PostsService, private authService: AuthService) { }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getarchivePosts(this.postsPerPage, this.currentPage );
    this.userId = this.authService.getUserId();
    // this.username = this.authService.getName();
    console.log(localStorage.getItem('profileimg'));
    this.profileimg = localStorage.getItem('profileimg');
    this.username =  localStorage.getItem('username');
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postData: { posts: Post[], postCount: number}) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        // this.username = this.authService.getName();
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


  dislikePost(id: string) {
    this.postsService.dislikePost(id).subscribe( () => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });

  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.removearchivePost(postId).subscribe(() => {
      this.postsService.getarchivePosts(this.postsPerPage, this.currentPage);
    });
  }

}
