import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  isLoading = false;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.isLoading = false;
    if (this.authService.getIsAuth()) {
      this.isLoading = true;
      this.router.navigate(['/messages']);
    }
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true ;
    this.authService.login(form.value.email, form.value.password);
  }

}
