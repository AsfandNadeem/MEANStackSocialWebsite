import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthData} from './auth-data.model';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticated = false;
  private isadvertiserAuthenticated = false;
  private token: string;
  public advertiserid: string;
  public advertisername: string;
  private tokenTimer: any;
  private userId: string;
  userN: string;
  private authStatusListener = new Subject<boolean>();
  // private userfetched: User;
  private userfetchedUpdated = new Subject<{email: any, usernamefetched: any, departmentfetched: any, registrationofetched: any }>();

  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this .token;
  }

  getadvertiserid() {
    return localStorage.getItem('advertiserid');
  }
  getadvertisername() {
    return localStorage.getItem('advertisername');
  }
  getName() {
    return localStorage.getItem('username');
  }
  getIsAuth() {
    return this.isAuthenticated;
  }
  getIsAdvertiserAuth() {
    return this.isadvertiserAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getUserId() {
    return this.userId;
  }

  createUser(email: string, image: File, username: string, department: string, registration: string ) {
    // const authData: AuthData = {email: email};
    const userData =  new FormData();
    userData.append('email', email);
    // userData.append('password', password);
    userData.append('username', username);
    userData.append('image', image, email);
    userData.append( 'department', department);
    userData.append('registration', registration);
    console.log(userData);
    this.http.post('http://localhost:3000/api/user/signup', userData)
      .subscribe(response => {
        console.log(response);
        this.router.navigate(['/login']);
      });
  }

  createAdvertiser(email: string, password: string, username: string ) {
    // const authData: AuthData = {email: email};
    const userData =  new FormData();
    userData.append('email', email);
    userData.append('password', password);
    userData.append('username', username);
    console.log(userData);
    this.http.post('http://localhost:3000/api/advertise/signup', {email, password, username})
      .subscribe(response => {
        console.log(response);
        this.router.navigate(['/advertise']);
      });
  }


  login(email: string, password: string) {
    // const authData: AuthData = {email: email, password: password};
    this.http.post<{token: string, expiresIn: number, userId: string, username: string, department: string, profileimg: any}>(
      'http://localhost:3000/api/user/login',
      {email, password})
      .subscribe( response => {
        const token = response.token;
        console.log(response);
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.userN = response.username;
          this.authStatusListener.next(true);
          console.log('here');
          const now = new Date();
          const expirationDate = new Date(now.getTime() + (expiresInDuration * 1000));
          console.log(expirationDate);
          console.log(response.profileimg);
          this.saveAuthData( token, expirationDate,
            this.userId, this.userN, response.department, response.profileimg);
          this.router.navigate(['/messages']).then();
        }
      } , error => {
        console.log('error');
        this.router.navigate(['/login']).then();
    });

  }


 advertiserlogin(email: string, password: string) {
    // const authData: AuthData = {email: email, password: password};
    this.http.post<{userId: string, username: string}>(
      'http://localhost:3000/api/advertise/login',
      {email, password})
      .subscribe( response => {
         console.log(response);
         this.advertiserid = response.userId;
          this.advertisername = response.username;
        this.isadvertiserAuthenticated = true;
          localStorage.setItem('advertiserid', this.advertiserid);
          localStorage.setItem('advertisername', this.advertisername);
          console.log('here');
         this.router.navigate(['/advertiserpage']).then();
         } , error => {
        console.log('error');
        // this.router.navigate(['/']).then();
      });

  }

  advertiserlogout() {
   this.advertiserid = null;
   this.advertisername = null;
    this.isadvertiserAuthenticated = false;
     localStorage.removeItem('advertiserid');
    localStorage.removeItem('advertisername');
    this.router.navigate(['/advertise']);
  }


  getProfile() {
    this.http.get<{email: any,
      username: any, department: any, registrationo: any}>
    ('http://localhost:3000/api/user/profile')
      .pipe(map((postData) => {
        return { email: postData.email, usernamefetched: postData.username,
          departmentfetched: postData.department, registrationofetched: postData.registrationo};
      }))
      .subscribe( transformedGroupPost => {
        this.userfetchedUpdated.next( {
          email: transformedGroupPost.email,
          usernamefetched: transformedGroupPost.usernamefetched,
          departmentfetched: transformedGroupPost.departmentfetched,
          registrationofetched: transformedGroupPost.registrationofetched
        });
      });
  }

  getProfileUpdateListener() {
    return this.userfetchedUpdated.asObservable();
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    this.userN = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);

  }
  autoAuthUser() {
    const authInformation =  this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private setAuthTimer( duration: number ) {
    console.log('Setting timer:' + duration);
    this.tokenTimer = setTimeout(() => {
        this.logout();
      },
      duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string, userNam: string, department: string, profileimg: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', userNam);
    localStorage.setItem('department', department);
    localStorage.setItem('profileimg', profileimg);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('department');
    localStorage.removeItem('profileimg');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if ( !token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
  }



  public updateUser(id: string , username: string, password: string) {


    console.log(id + '\n' + username + '\n' + password);


   const userData = {

    username: username,
    password: password
  };
      console.log(userData);
      this.http.put<{userId: string, username: string}>
    ('http://localhost:3000/api/user/edit/', userData)
      .subscribe(response => {
        console.log(response);
        localStorage.removeItem('username');
        localStorage.setItem('username', response.username);
        this.router.navigate(['/messages']);
      });
  }

}
