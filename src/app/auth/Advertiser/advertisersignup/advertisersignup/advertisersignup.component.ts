import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {AuthService} from '../../../auth.service';

@Component({
  selector: 'app-advertisersignup',
  templateUrl: './advertisersignup.component.html',
  styleUrls: ['./advertisersignup.component.css']
})
export class AdvertisersignupComponent implements OnInit {
  isLoading = false;
  constructor(public authService: AuthService) { }

  ngOnInit() {
  }


  onSignup(form: NgForm) {
    if ( form.invalid ) {
      return;
    }
    this.isLoading = true;
    // console.log(form.value.email, this.nform.value.image,
    //   form.value.password, form.value.uname, form.value.dname, form.value.regno);
    this.authService.createAdvertiser(form.value.email, form.value.password, form.value.uname);
  }
}
