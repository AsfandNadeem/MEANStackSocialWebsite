import {Component, OnInit, OnDestroy} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  username = 'nothing';
  private authListenerSubs: Subscription;
  constructor( private authService: AuthService) {


  }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.username = this.authService.getName();
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
