import { Component, OnInit } from '@angular/core';
import {AdminServiceService} from '../admin-service.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {

  isadminauthenticated = false;
  showuser = false;
  showgroups = false;
  showposts = false;
  showevents = false;
  constructor(private adminService: AdminServiceService, private router: Router) { }

  ngOnInit() {
    // if (this.adminService.getisAdmin()) {
    this.showuser = true;
    this.showgroups = false;
    this.showposts = false;
    this.showevents = false;
      this.isadminauthenticated = true;
    // } else {
    //   this.isadminauthenticated = false;
    //   this.router.navigate(['/admin']).then();
    // }
  }

  onUser() {
    this.showgroups = false;
    this.showposts = false;
    this.showevents = false;
    this.showuser = true;
  }

  onGroup() {
   this.showposts = false;
    this.showevents = false;
    this.showuser = false;
    this.showgroups = true;
  }



}
