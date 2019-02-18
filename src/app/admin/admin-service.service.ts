import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {User} from '../auth/user.model';
import {Group} from '../groups/group.model';
import {Events} from '../events/event.model';
import {Post} from '../posts/post.model';

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {

  isadmin = false;
  private users: User[] = [];
  private usersUpdated = new Subject<{users: User[], userCount: number}>();
  private groups: Group[] = [];
  private groupsUpdated = new Subject<{groups: Group[], groupCount: number}>();
  private events: Events[] = [];
  private eventsUpdated = new Subject<{events: Events[], eventCount: number}>();

  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string) {
    // const authData: AuthData = {email: email, password: password};
    this.http.post<{message: string}>(
      'http://localhost:3000/api/admin/login',
      {email, password})
      .subscribe( response => {
       this.isadmin = true;
        console.log(response.message);
          this.router.navigate(['/adminpage']).then();
          } , error => {
        this.isadmin = false;
        console.log(error.message);
        this.router.navigate(['/admin']).then();
      });

  }

  getisAdmin() {
    return this.isadmin;
  }

  getUsers() { // httpclientmodule
    // const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`; // `` backtips are for dynamically adding values into strings
    this.http
      .get<{message: string, users: any, maxUsers: number}>(
        'http://localhost:3000/api/admin/users' )
      .pipe(map((userData) => {
        return { users: userData.users.map(user => {
            return {
              profileimg: user.imagePath,
              username: user.username,
              id: user._id,
              // username : post.username,
              // creator: post.creator,
              // likes: post.likes,
              // category: post.category,
              // commentsNo: post.commentsNo,
              // comments: post.comments,
              // dislikes: post.dislikes,
              // createdAt: post.createdAt,
              // imagePath: post.imagePath
            };
          }), maxUsers: userData.maxUsers  };
      }))// change rterieving data
      .subscribe(transformedUserData => {
        this.users = transformedUserData.users;
        this.usersUpdated.next({
            users: [...this.users],
            userCount: transformedUserData.maxUsers
          }
        );
      }); // subscribe is to liosten
  }

  getUserUpdateListener() {
    return this.usersUpdated.asObservable();
  }

  getEvents() { // httpclientmodule
    // const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`; // `` backtips are for dynamically adding values into strings
    this.http
      .get<{message: string, events: any, maxEvents: number}>(
        'http://localhost:3000/api/admin/events' )
      .pipe(map((eventData) => {
        return { events: eventData.events.map(event => {
            return {
              eventname: event.eventname,
             eventid: event._id,
              // username : post.username,
              // creator: post.creator,
              // likes: post.likes,
              // category: post.category,
              // commentsNo: post.commentsNo,
              // comments: post.comments,
              // dislikes: post.dislikes,
              // createdAt: post.createdAt,
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

  getGroups() { // httpclientmodule
    // const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`; // `` backtips are for dynamically adding values into strings
    this.http
      .get<{message: string, groups: any, maxGroups: number}>(
        'http://localhost:3000/api/admin/groups' )
      .pipe(map((groupData) => {
        return { groups: groupData.groups.map(group => {
            return {
              groupname: group.groupname,
              groupid: group._id,
              // username : post.username,
              // creator: post.creator,
              // likes: post.likes,
              // category: post.category,
              // commentsNo: post.commentsNo,
              // comments: post.comments,
              // dislikes: post.dislikes,
              // createdAt: post.createdAt,
              // imagePath: post.imagePath
            };
          }), maxGroups: groupData.maxGroups  };
      }))// change rterieving data
      .subscribe(transformedGroupData => {
        this.groups = transformedGroupData.groups;
        this.groupsUpdated.next({
            groups: [...this.groups],
            groupCount: transformedGroupData.maxGroups
          }
        );
      }); // subscribe is to liosten
  }

  getGroupUpdateListener() {
    return this.groupsUpdated.asObservable();
  }
}
