import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Post } from './post.model';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';
import * as moment from 'moment';
export interface Notification {
  created: Date;
  sendername: string;
  message: string;
  senderimage: string;
}
export interface Advertisement {
  id: string;
  title: string;
  content: string;
  imagePath: string;
  username: string;
  createdAt: Date;
  adcreator: string;
  approved: boolean;
}
@Injectable({providedIn: 'root'})
export class PostsService {
  private notifications: Notification [] = [];
  private notificationUpdated = new Subject<{notifications: Notification[], notificationCount: number}>();
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();
  private archivedposts: Post[] = [];
  private archivedpostsUpdated = new Subject<{posts: Post[], postCount: number}>();
  private advertisements: Advertisement[] = [];
  private advertisementsUpdated = new Subject<{advertisements: Advertisement[], advertisementCount: number}>();
  private userposts: Post[] = [];
  private userpostsUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getadvertiserPosts(advertiserid: string) { // httpclientmodule
    // const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`; // `` backtips are for dynamically adding values into strings
    this.http
      .get<{message: string, posts: any,  username: string, maxPosts: number}>(
        'http://localhost:3000/api/advertise/' + advertiserid
      )
      .pipe(map((postData) => {
        return { advertisements: postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              username : post.username,
              adcreator: post.adcreator,
              approved: post.approved,
              createdAt: post.createdAt,
              imagePath: post.imagePath
            };
          }), maxPosts: postData.maxPosts  };
      }))// change rterieving data
      .subscribe(transformedAdvertisementData => {
        this.advertisements = transformedAdvertisementData.advertisements;
        this.advertisementsUpdated.next({
            advertisements: [...this.advertisements],
            advertisementCount: transformedAdvertisementData.maxPosts
          }
        );
      }); // subscribe is to liosten
  }

  getadvertisementPostUpdateListener() {
    return this.advertisementsUpdated.asObservable();
  }

  getuserPosts(userid: string) { // httpclientmodule
    // const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`; // `` backtips are for dynamically adding values into strings
    this.http
      .get<{message: string, posts: any,  username: string, maxPosts: number}>(
        'http://localhost:3000/api/posts/user/' + userid
      )
      .pipe(map((postData) => {
        return { posts: postData.posts.map(post => {
            return {
              profileimg: post.profileimg,
              title: post.title,
              content: post.content,
              id: post._id,
              username : post.username,
              creator: post.creator,
              likes: post.likes,
              likedBy: post.likedBy,
              dislikedBy: post.dislikedBy,
              category: post.category,
              commentsNo: post.commentsNo,
              comments: post.comments,
              dislikes: post.dislikes,
              createdAt: post.createdAt,
              imagePath: post.imagePath
            };
          }), maxPosts: postData.maxPosts  };
      }))// change rterieving data
      .subscribe(transformedPostData => {
        this.userposts = transformedPostData.posts;
        this.userpostsUpdated.next({
            posts: [...this.userposts],
            postCount: transformedPostData.maxPosts
          }
        );
      }); // subscribe is to liosten
  }

  getuserPostUpdateListener() {
    return this.userpostsUpdated.asObservable();
  }


  getPosts(postsPerPage: number, currentPage: number) { // httpclientmodule
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`; // `` backtips are for dynamically adding values into strings
   this.http
     .get<{message: string, posts: any,  username: string, maxPosts: number}>(
       'http://localhost:3000/api/posts' + queryParams
     )
     .pipe(map((postData) => {
       return { posts: postData.posts.map(post => {
         return {
           profileimg: post.profileimg,
           title: post.title,
           content: post.content,
           id: post._id,
           username : post.username,
           creator: post.creator,
           likes: post.likes,
           likedBy: post.likedBy,
           dislikedBy: post.dislikedBy,
           category: post.category,
           commentsNo: post.commentsNo,
           comments: post.comments,
           dislikes: post.dislikes,
           createdAt: post.createdAt,
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
  getNotifications() {
    this.http
      .get<{message: string, notifications: any,  username: string, maxNotifictaions: number}>(
        'http://localhost:3000/api/user/notifications'
      )
      .pipe(map((notificationData) => {
        return { notifications: notificationData.notifications.map(notification => {
            return {
              created: notification.created,
             sendername: notification.sendername,
             message: notification.message,
              senderimage: notification.senderimage,
            };
          }), maxNotifications: notificationData.maxNotifictaions  };
      }))// change rterieving data
      .subscribe(transformedNotifictaionData => {
        this.notifications = transformedNotifictaionData.notifications;
        this.notificationUpdated.next({
            notifications: [...this.notifications],
            notificationCount: transformedNotifictaionData.maxNotifications
          }
        );
      }); // subscribe is to liosten
  }

  getNotificationUpdateListener() {
    return this.notificationUpdated.asObservable();
  }


  addPost(title: string, content: string , image: File, category: string) {
    const postData =  new FormData();
    postData.append('title', title);
      postData.append('content', content);
    postData.append('image', image, title);
    postData.append( 'category', category);
    // postData.append('username', localStorage.getItem('username'));
    // postData.append('profileimg', profileimg);
    console.log(postData);
    this.http
      .post<{ message: string, post: Post }>(
        'http://localhost:3000/api/posts',
        postData)
      .subscribe( responseData  => {
        this.router.navigate(['/messages']);
      });
  }

  addAdvertisement(advertiserid: string, advertisername: string, title: string, content: string , image: File) {
    const postData =  new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    postData.append('username', advertisername);
    // postData.append('username', localStorage.getItem('username'));
    // postData.append('profileimg', profileimg);
    console.log(postData);
    return this.http
      .post<{ message: string }>(
        'http://localhost:3000/api/advertise/advertise/' + advertiserid,
        postData);
    // .subscribe( responseData  => {
    //   this.router.navigate(['/grouplist']);
    // });
  }

  // addAdvertisementPost(title: string, content: string , image: File, category: string) {
  //   const postData =  new FormData();
  //   postData.append('title', title);
  //   postData.append('content', content);
  //   postData.append('image', image, title);
  //   postData.append( 'category', category);
  //   // postData.append('username', localStorage.getItem('username'));
  //   // postData.append('profileimg', profileimg);
  //   console.log(postData);
  //   this.http
  //     .post<{ message: string, post: Post }>(
  //       'http://localhost:3000/api/posts/advert',
  //       postData)
  //     .subscribe( responseData  => {
  //       this.router.navigate(['/login']);
  //     });
  // }


 reportPost(title: string, content: string , username: string,
            creator: string, postid: string, reason: string) {
    const postData =  new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('username', username);
   postData.append('creator', creator);
    postData.append( 'postid', postid);
   // postData.append( 'reportedby', localStorage.getItem('userId'));
   postData.append('reason', reason);
    // postData.append('username', localStorage.getItem('username'));
    // postData.append('profileimg', profileimg);
    console.log(postData);
   return this.http
      .post<{ message: string, post: Post }>(
        'http://localhost:3000/api/posts/report',
        {title, content, username, creator, postid, reason});
      // .subscribe( responseData  => {
      //   this.router.navigate(['/messages']);
      // });
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string,
      title: string,
      content: string,
      username: string,
      category: string,
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
      postData.append('username', localStorage.getItem('username'));
      postData.append('image', image, title);
    } else {
       postData = {
        id: id,
        title: title,
        content: content,
         category: null,
         creator: null,
         likes: null,
         likedBy: null,
         profileimg: null,
         dislikedBy: null,
         dislikes: null,
         comments: null,
         commentsNo: null,
         createdAt: null,
         username: localStorage.getItem('username'),
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

  // postComment(id, comment) {
  //   const postData = {
  //     id: id,
  //     comment: comment
  //   };
  //   return this.http.post('http://localhost:3000/api/posts/comment/' + id, postData);
  // }

  likePost(id) {
    // @ts-ignore
    return this.http.put( 'http://localhost:3000/api/posts/likePost/' + id);
  }

  dislikePost(id) {
    // @ts-ignore
    return this.http.put( 'http://localhost:3000/api/posts/dislikePost/' + id);
  }

  addComment(id, comment) {
    const postdata = {
      id: id,
      comment: comment
    };
    // @ts-ignore
    return this.http.put( 'http://localhost:3000/api/posts/comment/' + id, postdata);
  }

  archivepost(id: string) {
    // @ts-ignore
    return this.http.put( 'http://localhost:3000/api/posts/archivePost/' + id);
  }

  removearchivePost(postId: string) {
    return this.http
      .delete('http://localhost:3000/api/posts/archives/' + postId);
  }

  getarchivePosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`; // `` backtips are for dynamically adding values into strings
    this.http
      .get<{message: string, posts: any,  username: string, maxPosts: number}>(
        'http://localhost:3000/api/posts/archives' + queryParams
      )
      .pipe(map((postData) => {
        return { posts: postData.posts.map(post => {
            return {
              profileimg: post.profileimg,
              title: post.title,
              content: post.content,
              id: post._id,
              username : post.username,
              creator: post.creator,
              likes: post.likes,
              likedBy: post.likedBy,
              dislikedBy: post.dislikedBy,
              category: post.category,
              commentsNo: post.commentsNo,
              comments: post.comments,
              dislikes: post.dislikes,
              createdAt: post.createdAt,
              imagePath: post.imagePath
            };
          }), maxPosts: postData.maxPosts  };
      }))// change rterieving data
      .subscribe(transformedPostData => {
        this.archivedposts = transformedPostData.posts;
        this.archivedpostsUpdated.next({
            posts: [...this.archivedposts],
            postCount: transformedPostData.maxPosts
          }
        );
      }); // subscribe is to liosten

  }
  getarchivePostUpdateListener() {
    return this.archivedpostsUpdated.asObservable();
  }
}
