import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Post } from './post.model';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}



  getPosts(postsPerPage: number, currentPage: number) { // httpclientmodule
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`; // `` backtips are for dynamically adding values into strings
   this.http
     .get<{message: string, posts: any,  username: string, maxPosts: number}>(
       'http://localhost:3000/api/posts'
     )
     .pipe(map((postData) => {
       return { posts: postData.posts.map(post => {
         return {
           title: post.title,
           content: post.content,
           id: post._id,
           creator: post.creator,
           imagePath: post.imagePath
         };
       }), maxPosts: postData.maxPosts  };
    }))// change rterieving data
     .subscribe(transformedPostData => {
      this.posts = transformedPostData.posts;
      this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        }
      );
     }); // subscribe is to liosten
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string , image: File) {
    const postData =  new FormData();
    postData.append('title', title);
      postData.append('content', content);
    postData.append('image', image, title);
    this.http
      .post<{ message: string, post: Post }>(
        'http://localhost:3000/api/posts',
        postData)
      .subscribe( responseData  => {
        this.router.navigate(['/messages']);
      });
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string,
      title: string,
      content: string,
      creator: string,
      imagePath: string
    }>('http://localhost:3000/api/posts/' + id) ;
  }

  updatePost(id: string , title: string, content: string, image: File | string) {
    let postData: Post |FormData ;
    if (typeof(image) === 'object') {
       postData = new FormData();
       postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
       postData = {
        id: id,
        title: title,
        content: content,
         creator: null,
        imagePath: image
      };

    }
    this.http.put('http://localhost:3000/api/posts/' + id, postData)
      .subscribe(response => {
        this.router.navigate(['/messages']);
      });
  }

  deletePost(postId: string) {
   return this.http
     .delete('http://localhost:3000/api/posts/' + postId);
        }
}
