import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {AdminServiceService} from '../admin-service.service';
import {Group} from '../../groups/group.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-admin-group',
  templateUrl: './admin-group.component.html',
  styleUrls: ['./admin-group.component.css']
})
export class AdminGroupComponent implements OnInit {

  dataSource: MatTableDataSource<Group>;
  groups: Group[] = [];
  private groupsSub: Subscription;
  totalGroups = 0;
  displayedColumns: string[] = ['name', 'id', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private adminService: AdminServiceService) {}

  ngOnInit() {
    this.adminService.getGroups();
    this.groupsSub = this.adminService.getGroupUpdateListener()
      .subscribe((groupData: { groups: Group[], groupCount: number}) => {
        this.totalGroups = groupData.groupCount;
        this.groups = groupData.groups;
        console.log(this.groups);
        this.dataSource = new MatTableDataSource(groupData.groups);
      });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
