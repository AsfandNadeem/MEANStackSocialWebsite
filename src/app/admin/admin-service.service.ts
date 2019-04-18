import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {User} from '../auth/user.model';
import {Group} from '../groups/group.model';
import {Events} from '../events/event.model';
import {Post} from '../posts/post.model';
import {PostsService} from '../posts/posts.service';


const BASEUURL = 'http://localhost:3000';
export interface Report {
  id: string;
  title: string;
  content: string;
  username: string;
  creator: string;
  reason: string;
  reportedby: string;
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
@Injectable({
  providedIn: 'root'
})


export class AdminServiceService {

  isadmin = false;
  private advertisements: Advertisement[] = [];
  private advertisementsUpdated = new Subject<{advertisements: Advertisement[], advertisementCount: number}>();
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

  constructor(private http: HttpClient, private router: Router, private postService: PostsService) { }

  login(email: string, password: string) {
    // const authData: AuthData = {email: email, password: password};
    this.http.post<{message: string}>(
      `${BASEUURL}/api/admin/login`,
      {email, password})
      .subscribe( response => {
       this.isadmin = true;
        console.log(response.message);
          this.router.navigate(['/adminpage']).then();
          } , error => {
        this.isadmin = false;
        console.log('invalid admin');
        this.router.navigate(['/admin']).then();
      });

  }

  getisAdmin() {
    return this.isadmin;
  }

  getadvertiserPosts() { // httpclientmodule
    // const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`; // `` backtips are for dynamically adding values into strings
    this.http
      .get<{message: string, posts: any,  username: string, maxPosts: number}>(
        `${BASEUURL}/api/admin/adverts`
      )
      .pipe(map((postData) => {
        return { advertisements: postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              username : post.username,
              adcreator: post.adcreator,
              approved: post.approved
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

  addAdvertisementPost(id: string) {
    const postData =  new FormData();
    postData.append('adid', id);
    // postData.append('content', content);
    // postData.append('image', image, title);
    // postData.append( 'category', category);
    // postData.append('username', localStorage.getItem('username'));
    // postData.append('profileimg', profileimg);
    console.log(postData);
    return this.http
      .post<{ message: string, post: Post }>(
        `${BASEUURL}/api/posts/advert`,
        postData);
  }

  getadvertisementPostUpdateListener() {
    return this.advertisementsUpdated.asObservable();
  }
  logoutAdmin() {
    this.isadmin = false;
    this.posts = null;
    this.advertisements = null;
    this.groups = null;
    this.events = null;
    this.users = null;
    this.router.navigate(['/']);
  }

  getPosts() { // httpclientmodule
    // const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`; // `` backtips are for dynamically adding values into strings
    this.http
      .get<{message: string, posts: any, maxPosts: number}>(
        `${BASEUURL}/api/admin/posts`
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
        `${BASEUURL}/api/admin/reports`
      )
      .pipe(map((reportData) => {
        return { reports: reportData.reports.map(report => {
            return {
              // profleimg: post.profileimg,
              reporttitle: report.title,
              reportcontent: report.content,
              postid: report.postid,
              reportid: report._id,
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
        `${BASEUURL}/api/admin/users` )
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
        `${BASEUURL}/api/admin/events` )
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
        `${BASEUURL}/api/admin/groups` )
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

  deletePost(postId: string) {
    return this.http
      .delete(`${BASEUURL}/api/admin/posts/` + postId);
  }

  deleteReport(postId: string) {
    return this.http
      .delete(`${BASEUURL}/api/admin/reports/` + postId);
  }

  deleteAdvertisement(postId: string) {
    return this.http
      .delete(`${BASEUURL}/api/admin/advertisements/` + postId);
  }
  removeReport(postId: string) {
    return this.http
      .delete(`${BASEUURL}/api/admin/removereports/` + postId);
  }

  deleteGroup(postId: string) {
    return this.http
      .delete(`${BASEUURL}/api/admin/groups/` + postId);
  }

  deleteEvent(postId: string) {
    return this.http
      .delete(`${BASEUURL}/api/admin/events/` + postId);
  }
}
