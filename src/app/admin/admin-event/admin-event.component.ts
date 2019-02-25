import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {AdminServiceService} from '../admin-service.service';
import {Events} from '../../events/event.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-admin-event',
  templateUrl: './admin-event.component.html',
  styleUrls: ['./admin-event.component.css']
})
export class AdminEventComponent implements OnInit {

  dataSource: MatTableDataSource<Events>;
  events: Events[] = [];
  private eventsSub: Subscription;
  totalEvents = 0;
  displayedColumns: string[] = ['name', 'id', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private adminService: AdminServiceService) {}

  ngOnInit() {
      this.adminService.getEvents();
      this.eventsSub = this.adminService.getEventUpdateListener()
        .subscribe((eventData: { events: Events[], eventCount: number}) => {
          this.totalEvents = eventData.eventCount;
          this.events = eventData.events;
          console.log(this.events);
          this.dataSource = new MatTableDataSource(eventData.events);
        });
    }

    applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }

}
