import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import {Event} from './event.model';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Post} from '../posts/post.model';

@Injectable({providedIn: 'root'})
export class EventsService {
  username = '';
  private events: Event[] = [];
  private posts: Post[] = [];
  private eventsUpdated = new Subject<{events: Event[], eventCount: number}>();
  private postsUpdated = new Subject<{posts: Post[]}>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(id: string) {
    console.log('eventinservicee' + id);
    this.http.get<{posts: any}>
    ('http://localhost:3000/api/events/' + id)
      .pipe(map((postData) => {
        return { posts: postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            username : post.username,
            creator: post.creator,
            likes: post.likes,
            id: post._id,
            commentsNo: post.commentsNo,
            comments: post.comments,
            profileimg: post.profileimg,
            dislikes: post.dislikes,
            createdAt: post.createdAt,
            imagePath: post.imagePath
          };
          })};
      }))
      .subscribe( transformedEventPost => {
        this.posts = transformedEventPost.posts;
        this.postsUpdated.next( {
          posts: [...this.posts]
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }


  getEvents(eventsPerPage: number, currentPage: number) { // httpclientmodule
    const queryParams = `?pagesize=${eventsPerPage}&page=${currentPage}`; // `` backtips are for dynamically adding values into strings
    this.http
      .get<{message: string, events: any,  username: string, maxEvents: number}>(
        'http://localhost:3000/api/events' + queryParams
      )
      .pipe(map((eventData) => {
        return { events: eventData.events.map(event => {
            return {
              eventname: event.eventname,
              description: event.description,
              id: event._id,
              eventdate: event.eventdate,
              username : event.username,
              creator: event.eventcreator,
              category: event.category,
              // imagePath: post.imagePath
            };
          }), maxEvents: eventData.maxEvents  };
      }))// change rterieving data
      .subscribe(transformedEventData => {
        this.events = transformedEventData.events;
        this.eventsUpdated.next({
            events: [...this.events],
          eventCount: transformedEventData.maxEvents
          }
        );
      }); // subscribe is to liosten
  }

  getEventUpdateListener() {
    return this.eventsUpdated.asObservable();
  }

  addEvent(eventname: string,  category: string, description: string, eventdate: Date, username: string) {
    return this.http
      .post(
        'http://localhost:3000/api/events',
        {eventname, description, category, eventdate, username})
      .subscribe( responseData  => {
        this.router.navigate(['/eventlist']);
      });
  }

  addPost(id: string, title: string, content: string , image: File, profileimg: string) {
    const postData =  new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    postData.append('username', localStorage.getItem('username'));
    postData.append('profileimg', profileimg);
    console.log(postData);
    this.http
      .put<{ message: string }>(
        'http://localhost:3000/api/events/addeventPost/' + id,
        postData)
      .subscribe( responseData  => {
        this.router.navigate(['/eventpage/' + id]);
      });
  }

  joinEvent( id: string) {
    // @ts-ignore
    this.http
      .put<{ message: string }>(
        'http://localhost:3000/api/events/adduser/' + id)
      .subscribe(responseData  => {
        this.router.navigate(['/eventpage/' + id]);
      });
         }

  // getPost(id: string) {
  //   return this.http.get<{
  //     _id: string,
  //     title: string,
  //     content: string,
  //     username: string,
  //     category: string,
  //     creator: string,
  //     imagePath: string
  //   }>('http://localhost:3000/api/posts/' + id) ;
  // }
  //
  // updatePost(id: string , title: string, content: string, image: File | string) {
  //   let postData: Post |FormData ;
  //   if (typeof(image) === 'object') {
  //      postData = new FormData();
  //      postData.append('id', id);
  //     postData.append('title', title);
  //     postData.append('content', content);
  //     postData.append('username', localStorage.getItem('username'));
  //     postData.append('image', image, title);
  //   } else {
  //      postData = {
  //       id: id,
  //       title: title,
  //       content: content,
  //        category: null,
  //        creator: null,
  //        username: localStorage.getItem('username'),
  //       imagePath: image
  //     };
  //
  //   }
  //   this.http.put('http://localhost:3000/api/posts/' + id, postData)
  //     .subscribe(response => {
  //       this.router.navigate(['/messages']);
  //     });
  // }
  //
  // deletePost(postId: string) {
  //   return this.http
  //     .delete('http://localhost:3000/api/posts/' + postId);
  // }
  //
  // // postComment(id, comment) {
  // //   const postData = {
  // //     id: id,
  // //     comment: comment
  // //   };
  // //   return this.http.post('http://localhost:3000/api/posts/comment/' + id, postData);
  // // }
  //
  likePost(postid: string, eventid: string) {
    const eventData =  {
      eventid: eventid,
      postid: postid
    };
    // @ts-ignore
    return this.http.put( 'http://localhost:3000/api/events/likeeventpost', eventData);
  }
  //
  dislikePost(postid: string, eventid: string) {
    const eventData =  {
      eventid: eventid,
      postid: postid
    };
    // @ts-ignore
    return this.http.put( 'http://localhost:3000/api/events/dislikeeventpost', eventData);
  }

   addComment(postid: string, eventid: string, comment: string) {
    const eventData =  {
      eventid: eventid,
      postid: postid,
      comment: comment
    };
    // @ts-ignore
    return this.http.put( 'http://localhost:3000/api/events/commenteventpost', eventData);
  }
}
