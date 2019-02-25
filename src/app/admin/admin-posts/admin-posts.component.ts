import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {AdminServiceService} from '../admin-service.service';
import {Post} from '../../posts/post.model';
import {Subscription} from 'rxjs';




@Component({
  selector: 'app-admin-posts',
  templateUrl: './admin-posts.component.html',
  styleUrls: ['./admin-posts.component.css']
})
export class AdminPostsComponent implements OnInit {

  dataSource: MatTableDataSource<Post>;
  posts: Post[] = [];
  totalPosts = 0;
  private postsSub: Subscription;
  displayedColumns: string[] = ['title', 'content', 'id', 'user', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private adminService: AdminServiceService) {}


  ngOnInit() {
    this.adminService.getPosts();
    this.postsSub = this.adminService.getPostUpdateListener()
      .subscribe((postData: { posts: Post[], postCount: number}) => {
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
        console.log(this.posts);
        this.dataSource = new MatTableDataSource(postData.posts);
      });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
