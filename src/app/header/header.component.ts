import {Component, OnInit, OnDestroy} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {Subscription} from 'rxjs';
import {SearchService} from './search.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { debounceTime, tap, finalize, distinctUntilChanged} from 'rxjs/operators';
// import 'rxjs/add/operator/debounceTime';
// import 'rxjs/add/operator/distinctUntilChanged';
import { switchMap } from 'rxjs/operators';
import {Observable} from 'rxjs';
// import {User} from '../auth/user.model';
 export interface Users {
   username: string;
   userid: string;
 }

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  username = 'nothing';
  private authListenerSubs: Subscription;
  results: Users[] = [];
  queryField: FormControl = new FormControl();
  constructor(private _searchService: SearchService,
              private authService: AuthService) {


  }

  ngOnInit() {

    this.queryField.valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(query => (this._searchService.search(query)))
      )
      .subscribe( (userData: {users: Users[]}) => {
        this.results = userData.users;
        console.log(this.results);
        }, error => {
      this.results = null;
    }
        // result => {
        // if (result.status === 400) {
        //   return;
        // } else {
        // console.log(result.valueOf());
          // this.results = result.toString();
        // }
      // }
      );

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.username = localStorage.getItem('username');
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.username = this.authService.getName();
      });
  }

  onLogout() {
    this.authService.logout();
    this.username = null;
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();

  }
}
