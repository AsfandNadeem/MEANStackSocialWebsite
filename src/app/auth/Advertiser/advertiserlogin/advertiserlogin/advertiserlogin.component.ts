import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../../auth.service';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-advertiserlogin',
  templateUrl: './advertiserlogin.component.html',
  styleUrls: ['./advertiserlogin.component.css']
})
export class AdvertiserloginComponent implements OnInit, OnDestroy {
  isLoading = false;
  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.isLoading = false;
  }

  ngOnDestroy() {
    this.isLoading = false;
  }

  onLogin(form: NgForm) {
    console.log(form.value.email + '' + form.value.password);
    if (form.invalid) {
      return;
    }
    this.isLoading = false;
    this.authService.advertiserlogin(form.value.email, form.value.password);
  }

}
