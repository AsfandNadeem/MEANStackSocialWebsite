import {Component, OnDestroy, OnInit} from '@angular/core';
import {AdminServiceService} from '../admin-service.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit , OnDestroy {

  isadminauthenticated = false;
  showuser = false;
  showgroups = false;
  showposts = false;
  showevents = false;
  showreports = false;
  showads = false;
  constructor(private adminService: AdminServiceService, private router: Router) { }

  ngOnInit() {
    if (this.adminService.getisAdmin()) {
    this.showuser = true;
    this.showgroups = false;
    this.showposts = false;
    this.showevents = false;
    this.showreports = false;
    this.showads = false;
      this.isadminauthenticated = true;
    } else {
      this.isadminauthenticated = false;
      this.router.navigate(['/admin']).then();
    }
  }

  onUser() {
    this.showgroups = false;
    this.showposts = false;
    this.showads = false;
    this.showevents = false;
    this.showreports = false;
    this.showuser = true;
  }

  onGroups() {
   this.showposts = false;
    this.showevents = false;
    this.showads = false;
    this.showuser = false;
    this.showreports = false;
    this.showgroups = true;
  }

  onPosts() {
   this.showevents = false;
    this.showuser = false;
    this.showads = false;
    this.showreports = false;
    this.showgroups = false;
    this.showposts = true;
  }

  onEvents() {
    this.showposts = false;
    this.showuser = false;
    this.showads = false;
    this.showreports = false;
    this.showgroups = false;
    this.showevents = true;
  }
  onReports() {
    this.showposts = false;
    this.showads = false;
    this.showuser = false;
    this.showgroups = false;
    this.showevents = false;
    this.showreports = true;
  }
  onAds() {
    this.showposts = false;
    this.showuser = false;
    this.showgroups = false;
    this.showevents = false;
    this.showreports = false;
    this.showads = true;
  }
  onLogout() {
    this.isadminauthenticated = false;
   this.adminService.logoutAdmin();
  }

  ngOnDestroy() {
    this.isadminauthenticated = false;
  }



}
