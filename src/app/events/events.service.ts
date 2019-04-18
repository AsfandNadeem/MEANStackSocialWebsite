import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import {Events} from './event.model';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Post} from '../posts/post.model';
const BASEUURL = 'http://localhost:3000';
@Injectable({providedIn: 'root'})
export class EventsService {
  username = '';
  private events: Events[] = [];
  private posts: Post[] = [];
  private eventsUpdated = new Subject<{events: Events[], eventCount: number}>();
  private postsUpdated = new Subject<{posts: Post[], eventcreatorid: any, eventmembers: any, eventname: string,
    eventdate: Date, description: string, eventcreator: string}>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(id: string) {
    console.log('eventinservicee' + id);
    this.http.get<{eventcreatorid: any,
      eventmembers: any, eventname: any, eventdate: Date, description: any, eventcreator: any, posts: any}>
    (`${BASEUURL}/api/events/` + id)
      .pipe(map((postData) => {
        return { posts: postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            username : post.username,
            creator: post.creator,
            likes: post.likes,
            likedBy: post.likedBy,
            dislikedBy: post.dislikedBy,
            id: post._id,
            commentsNo: post.commentsNo,
            comments: post.comments,
            profileimg: post.profileimg,
            dislikes: post.dislikes,
            createdAt: post.createdAt,
            imagePath: post.imagePath
          };
          }), eventcreatorid: postData.eventcreatorid, eventmembers:  postData.eventmembers, eventname: postData.eventname,
          eventcreator: postData.eventcreator,
        eventdescription: postData.description, eventdate: postData.eventdate};
      }))
      .subscribe( transformedEventPost => {
        this.posts = transformedEventPost.posts;
        this.postsUpdated.next( {
          posts: [...this.posts],
          eventcreatorid: transformedEventPost.eventcreatorid,
          eventmembers: transformedEventPost.eventmembers,
          eventname: transformedEventPost.eventname,
          eventdate: transformedEventPost.eventdate,
          description: transformedEventPost.eventdescription,
          eventcreator: transformedEventPost.eventcreator
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
        `${BASEUURL}/api/events` + queryParams
      )
      .pipe(map((eventData) => {
        return { events: eventData.events.map(event => {
            return {
              eventname: event.eventname,
              description: event.description,
              id: event._id,
              eventdate: event.eventdate,
              eventmembersid: event.eventmembersid,
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

  getJoinedEvents() { // httpclientmodule
    this.http
      .get<{message: string, events: any,  maxEvents: number}>(
        `${BASEUURL}/api/events/joinedevents`)
      .pipe(map((eventData) => {
        return { events: eventData.events.map(event => {
            return {
              eventname: event.eventname,
              // description: group.description,
              id: event._id,
              // username : group.username,
              // creator: group.groupcreator,
              // category: group.category,
              // // imagePath: post.imagePath
            };
          }), maxEvents: eventData.maxEvents };
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

  updateEvent(id: string , eventname: string, description: string, eventdate: Date) {
    return this.http.put(`${BASEUURL}/api/events/` + id, {eventname, description, eventdate});
     }

  addEvent(eventname: string,  category: string, description: string, eventdate: Date, username: string) {
    return this.http
      .post(
        `${BASEUURL}/api/events`,
        {eventname, description, category, eventdate, username})
      .subscribe( responseData  => {
        this.router.navigate(['/eventlist']);
      });
  }

  addPost(id: string, title: string, content: string , image: File) {
    const postData =  new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    // postData.append('username', localStorage.getItem('username'));
    // postData.append('profileimg', profileimg);
    console.log(postData);
    return this.http
      .put<{ message: string }>(
        `${BASEUURL}/api/events/addeventPost/` + id,
        postData);
      // .subscribe( responseData  => {
      //   this.router.navigate(['/eventpage/' + id]);
      // });
  }

  joinEvent( id: string) {
    // @ts-ignore
    this.http
      .put<{ message: string }>(
        `${BASEUURL}/api/events/adduser/` + id)
      .subscribe(responseData  => {
        this.router.navigate(['/eventpage/' + id]);
      });
         }

  likePost(postid: string, eventid: string) {
    const eventData =  {
      eventid: eventid,
      postid: postid
    };
    // @ts-ignore
    return this.http.put( `${BASEUURL}/api/events/likeeventpost/` + eventid, eventData);
  }
  //
  dislikePost(postid: string, eventid: string) {
    const eventData =  {
      eventid: eventid,
      postid: postid
    };
    // @ts-ignore
    return this.http.put( `${BASEUURL}/api/events/dislikeeventpost/` + eventid, eventData);
  }

   addComment(postid: string, eventid: string, comment: string) {
    const eventData =  {
      eventid: eventid,
      postid: postid,
      comment: comment
    };
    // @ts-ignore
    return this.http.put( `${BASEUURL}/api/events/commenteventpost/` + eventid, eventData);
  }
}
