import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {User} from '../auth/user.model';
import {Group} from '../groups/group.model';
import {Events} from '../events/event.model';
import {Post} from '../posts/post.model';

export interface Report {
  id: string;
  title: string;
  content: string;
  username: string;
  creator: string;
  reason: string;
  reportedby: string;
}

@Injectable({
  providedIn: 'root'
})


export class AdminServiceService {

  isadmin = false;
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();
  private users: User[] = [];
  private usersUpdated = new Subject<{users: User[], userCount: number}>();
  private groups: Group[] = [];
  private groupsUpdated = new Subject<{groups: Group[], groupCount: number}>();
  private events: Events[] = [];
  private eventsUpdated = new Subject<{events: Events[], eventCount: number}>();
  private reports: Report[] = [];
  private reportsUpdated = new Subject<{reports: Report[], reportCount: number}>();

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

  getPosts() { // httpclientmodule
    // const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`; // `` backtips are for dynamically adding values into strings
    this.http
      .get<{message: string, posts: any, maxPosts: number}>(
        'http://localhost:3000/api/admin/posts'
      )
      .pipe(map((postData) => {
        return { posts: postData.posts.map(post => {
            return {
             // profleimg: post.profileimg,
              title: post.title,
              content: post.content,
              id: post._id,
              username : post.username,
              creator: post.creator,
              // likes: post.likes,
              // likedBy: post.likedBy,
              // dislikedBy: post.dislikedBy,
              // category: post.category,
              // commentsNo: post.commentsNo,
              // comments: post.comments,
              // dislikes: post.dislikes,
              // createdAt: post.createdAt,
              // imagePath: post.imagePath
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

  getReports() { // httpclientmodule
    // const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`; // `` backtips are for dynamically adding values into strings
    this.http
      .get<{message: string, reports: any, maxReports: number}>(
        'http://localhost:3000/api/admin/reports'
      )
      .pipe(map((reportData) => {
        return { reports: reportData.reports.map(report => {
            return {
              // profleimg: post.profileimg,
              reporttitle: report.title,
              reportcontent: report.content,
              reportid: report.postid,
              reportusername : report.username,
              reportcreator: report.creator,
              reportreason: report.reason,
              reportreportedby: report.reportedby
              // likes: post.likes,
              // likedBy: post.likedBy,
              // dislikedBy: post.dislikedBy,
              // category: post.category,
              // commentsNo: post.commentsNo,
              // comments: post.comments,
              // dislikes: post.dislikes,
              // createdAt: post.createdAt,
              // imagePath: post.imagePath
            };
          }), maxReports: reportData.maxReports  };
      }))// change rterieving data
      .subscribe(transformedReportData => {
        this.reports = transformedReportData.reports;
        this.reportsUpdated.next({
            reports: [...this.reports],
           reportCount: transformedReportData.maxReports
          }
        );
      }); // subscribe is to liosten
  }

  getReportUpdateListener() {
    return this.reportsUpdated.asObservable();
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
