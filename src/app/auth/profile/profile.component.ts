import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {mimeType} from '../../posts/post-create/mime-type.validator';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {User} from '../../auth/user.model';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  isLoading = false;
  form: FormGroup;
  private mode = 'create';
  private userId: string;
  user: User;

  constructor(public authService: AuthService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.form = new FormGroup({
      username : new FormControl(null, {
        validators : [Validators.required, Validators.minLength(3)]
      }),
      password : new FormControl(null, {
        validators : [Validators.required]
      })
    });
  }

  onEdit() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    console.log(this.form.value.username + '\n' + this.form.value.password + '\n' + localStorage.getItem('userId'));
    this.authService.updateUser(
        localStorage.getItem('userId'),
        this.form.value.username,
        this.form.value.password);
    this.form.reset();
  }


}
