import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {Group} from './group.model';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Post} from '../posts/post.model';

@Injectable({providedIn: 'root'})
export class GroupsService {
  username = '';
  private groups: Group[] = [];
  private posts: Post[] = [];
  private groupsUpdated = new Subject<{groups: Group[], groupCount: number}>();

  private postsUpdated = new Subject<{posts: Post[]}>();

  constructor(private http: HttpClient, private router: Router) {}


  getPosts(id: string) {
    console.log('inservicee' + id);
    this.http.get<{posts: any}>
    ('http://localhost:3000/api/groups/' + id)
      .pipe(map((postData) => {
        return { posts: postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            username : post.username,
            creator: post.creator,
            likes: post.likes,
            commentsNo: post.commentsNo,
            comments: post.comments,
            dislikes: post.dislikes,
            profileimg: post.profileimg,
            id: post._id,
            createdAt: post.createdAt,
            imagePath: post.imagePath
          };
          })};
      }))
      .subscribe( transformedGroupPost => {
        this.posts = transformedGroupPost.posts;
        this.postsUpdated.next( {
          posts: [...this.posts]
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getGroups(groupsPerPage: number, currentPage: number) { // httpclientmodule
    const queryParams = `?pagesize=${groupsPerPage}&page=${currentPage}`; // `` backtips are for dynamically adding values into strings
   this.http
     .get<{message: string, groups: any,  username: string, maxGroups: number}>(
       'http://localhost:3000/api/groups' + queryParams
     )
     .pipe(map((groupData) => {
       return { groups: groupData.groups.map(group => {
         return {
           groupname: group.groupname,
           description: group.description,
           id: group._id,
           username : group.username,
           creator: group.groupcreator,
           category: group.category,
           // imagePath: post.imagePath
         };
       }), maxGroups: groupData.maxGroups  };
    }))// change rterieving data
     .subscribe(transformedGroupData => {
      this.groups = transformedGroupData.groups;
      this.groupsUpdated.next({
          groups: [...this.groups],
          groupCount: transformedGroupData.maxGroups
        }
      );
     }); // subscribe is to liosten
  }


  getJoinedGroups() { // httpclientmodule
  this.http
      .get<{message: string, groups: any,  maxGroups: number}>(
        'http://localhost:3000/api/groups/joinedgroups')
      .pipe(map((groupData) => {
        return { groups: groupData.groups.map(group => {
            return {
              groupname: group.groupname,
              // description: group.description,
              id: group._id,
              // username : group.username,
              // creator: group.groupcreator,
              // category: group.category,
              // // imagePath: post.imagePath
            };
          }), maxGroups: groupData.maxGroups };
      }))// change rterieving data
      .subscribe(transformedGroupData => {
        this.groups = transformedGroupData.groups;
        this.groupsUpdated.next({
            groups: [...this.groups],
          groupCount: transformedGroupData.maxGroups
          }
        );
       }); // subscribe is to liosten
  }

  deletePost(groupId: string, postId: string) {
    const queryParams = `?groupid=${groupId}&postid=${postId}`;
    return this.http
      .delete('http://localhost:3000/api/groups/delete' + queryParams);
  }

  getGroupUpdateListener() {
    return this.groupsUpdated.asObservable();
  }

  addGroup(groupname: string,  category: string, description: string, username: string) {
    return this.http
      .post(
        'http://localhost:3000/api/groups',
        {groupname, description, category, username})
      .subscribe( responseData  => {
        this.router.navigate(['/grouplist']);
      });
  }

  addPost(id: string, title: string, content: string , image: File) {
    const postData =  new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    // postData.append('username', localStorage.getItem('username'));
    // postData.append('profileimg', profileimg);
    console.log(postData);
    this.http
      .put<{ message: string }>(
        'http://localhost:3000/api/groups/addgroupPost/' + id,
        postData)
      .subscribe( responseData  => {
        this.router.navigate(['/grouplist']);
      });
  }

  joinGroup( id: string) {
    // @ts-ignore
    this.http
      .put<{ message: string }>(
        'http://localhost:3000/api/groups/adduser/' + id)
      .subscribe(responseData  => {
        this.router.navigate(['/grouppage/' + id]);
      });
  }

  likePost(postid: string, groupid: string) {
    const groupData =  {
      groupid: groupid,
      postid: postid
    };
    // @ts-ignore
    return this.http.put( 'http://localhost:3000/api/groups/likegrouppost', groupData);
  }
  //
  dislikePost(postid: string, groupid: string) {
    const groupData =  {
      groupid: groupid,
      postid: postid
    };
    // @ts-ignore
    return this.http.put( 'http://localhost:3000/api/groups/dislikegrouppost', groupData);
  }

  addComment(postid: string, groupid: string, comment: string) {
    const groupData =  {
      groupid: groupid,
      postid: postid,
      comment: comment
    };
    // @ts-ignore
     return this.http.put( 'http://localhost:3000/api/groups/commentgrouppost', groupData);
  }
}
