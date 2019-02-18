import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {User} from '../auth/user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {

  isadmin = false;
  private users: User[] = [];
  private usersUpdated = new Subject<{users: User[], userCount: number}>();

  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string) {
    // const authData: AuthData = {email: email, password: password};
    this.http.post<{adminuser: string}>(
      'http://localhost:3000/api/admin/login',
      {email, password})
      .subscribe( response => {
       this.isadmin = true;
        console.log(response);
          this.router.navigate(['/adminpage']).then();
          } , error => {
        this.isadmin = false;
        console.log(this.isadmin);
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
}
