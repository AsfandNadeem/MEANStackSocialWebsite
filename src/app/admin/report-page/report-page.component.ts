import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

import {Subscription} from 'rxjs';
import {AdminServiceService} from '../admin-service.service';

export interface Report {
  id: string;
  title: string;
  content: string;
  username: string;
  creator: string;
}


@Component({
  selector: 'app-report-page',
  templateUrl: './report-page.component.html',
  styleUrls: ['./report-page.component.css']
})
export class ReportPageComponent implements OnInit {

  dataSource: MatTableDataSource<Report>;
  reports: Report[] = [];
  totalReports = 0;
  private reportsSub: Subscription;
  displayedColumns: string[] = ['title', 'content', 'id', 'user', 'report', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private adminService: AdminServiceService) {}
  ngOnInit() {
    this.adminService.getReports();
    this.reportsSub = this.adminService.getReportUpdateListener()
      .subscribe((reportData: { reports: Report[], reportCount: number}) => {
        this.totalReports = reportData.reportCount;
        this.reports = reportData.reports;
        console.log(this.reports);
        this.dataSource = new MatTableDataSource(reportData.reports);
      });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
