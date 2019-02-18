import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {AdminServiceService} from '../admin-service.service';
import {User} from '../../auth/user.model';
import {Subscription} from 'rxjs';


// export interface UserData {
//   id: string;
//   name: string;
//   progress: string;
//   color: string;
// }

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {

  dataSource: MatTableDataSource<User>;
  users: User[] = [];
  private usersSub: Subscription;
  totalUsers = 0;
  displayedColumns: string[] = ['name', 'id'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private adminService: AdminServiceService) {}

  ngOnInit() {
    this.adminService.getUsers();
    this.usersSub = this.adminService.getUserUpdateListener()
      .subscribe((userData: { users: User[], userCount: number}) => {
        this.totalUsers = userData.userCount;
        this.users = userData.users;
        console.log(this.users);
        this.dataSource = new MatTableDataSource(userData.users);
      });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}

