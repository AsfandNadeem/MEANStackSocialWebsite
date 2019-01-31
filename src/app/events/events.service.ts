import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import {Event} from './event.model';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable({providedIn: 'root'})
export class EventsService {
  username = '';
  private events: Event[] = [];
  private eventsUpdated = new Subject<{events: Event[], eventCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}


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
        this.router.navigate(['/messages']);
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
  // likePost(id) {
  //   // @ts-ignore
  //   return this.http.put( 'http://localhost:3000/api/posts/likePost/' + id);
  // }
  //
  // dislikePost(id) {
  //   // @ts-ignore
  //   return this.http.put( 'http://localhost:3000/api/posts/dislikePost/' + id);
  // }
  //
  // addComment(id, comment) {
  //   const postdata = {
  //     id: id,
  //     comment: comment
  //   };
  //   // @ts-ignore
  //   return this.http.put( 'http://localhost:3000/api/posts/comment/' + id, postdata);
  // }
}
