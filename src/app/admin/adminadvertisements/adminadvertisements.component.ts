import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {AdminServiceService} from '../admin-service.service';
import {Subscription} from 'rxjs';
import {Post} from '../../posts/post.model';

export interface Advertisement {
  id: string;
  title: string;
  content: string;
  imagePath: string;
  username: string;
  createdAt: Date;
  adcreator: string;
  approved: boolean;
}
@Component({
  selector: 'app-adminadvertisements',
  templateUrl: './adminadvertisements.component.html',
  styleUrls: ['./adminadvertisements.component.css']
})
export class AdminadvertisementsComponent implements OnInit {
  dataSource: MatTableDataSource<Advertisement>;
  posts: Advertisement[] = [];
  totalPosts = 0;
  private addsSub: Subscription;
  displayedColumns: string[] = ['title', 'content', 'id', 'username', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(public adminService: AdminServiceService) { }

  ngOnInit() {
    this.adminService.getadvertiserPosts();
    this.addsSub = this.adminService.getadvertisementPostUpdateListener()
      .subscribe((postData: { advertisements: Advertisement[], advertisementCount: number}) => {
        this.totalPosts = postData.advertisementCount;
        this.posts = postData.advertisements;
        console.log(this.posts);
        this.dataSource = new MatTableDataSource(postData.advertisements);
      });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  approve(advertisement: Advertisement) {
           this.adminService.addAdvertisementPost(advertisement.id).subscribe( () => {
          this.adminService.getadvertiserPosts();
        });
  }
  onDelete(postId: string) {
    this.adminService.deleteAdvertisement(postId).subscribe(() => {
      this.adminService.getadvertiserPosts();
    });
  }
}
