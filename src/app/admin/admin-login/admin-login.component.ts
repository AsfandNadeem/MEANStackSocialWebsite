import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {AdminServiceService} from '../admin-service.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

  constructor(public adminService: AdminServiceService) { }

  ngOnInit() {
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    // this.isLoading = true ;
    this.adminService.login(form.value.email, form.value.password);
  }

}
