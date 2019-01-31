import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import {Group} from './group.model';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable({providedIn: 'root'})
export class GroupsService {
  username = '';
  private groups: Group[] = [];
  private groupsUpdated = new Subject<{groups: Group[], groupCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}



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

  getGroupUpdateListener() {
    return this.groupsUpdated.asObservable();
  }

  addGroup(groupname: string,  category: string, description: string, username: string) {
    return this.http
      .post(
        'http://localhost:3000/api/groups',
        {groupname, description, category, username})
      .subscribe( responseData  => {
        this.router.navigate(['/messages']);
      });
  }

  // getPost(id: string) {
  //   return this.http.get<{
  //     _id: string,
  //     title: string,
  //     content: string,
  //     username: string,
  //     category: string,
  //     creator: string,
  //     imagePath: string
  //   }>('http://localhost:3000/api/posts/' + id) ;
  // }
  //
  // updatePost(id: string , title: string, content: string, image: File | string) {
  //   let postData: Post |FormData ;
  //   if (typeof(image) === 'object') {
  //      postData = new FormData();
  //      postData.append('id', id);
  //     postData.append('title', title);
  //     postData.append('content', content);
  //     postData.append('username', localStorage.getItem('username'));
  //     postData.append('image', image, title);
  //   } else {
  //      postData = {
  //       id: id,
  //       title: title,
  //       content: content,
  //        category: null,
  //        creator: null,
  //        username: localStorage.getItem('username'),
  //       imagePath: image
  //     };
  //
  //   }
  //   this.http.put('http://localhost:3000/api/posts/' + id, postData)
  //     .subscribe(response => {
  //       this.router.navigate(['/messages']);
  //     });
  // }
  //
  // deletePost(postId: string) {
  //   return this.http
  //     .delete('http://localhost:3000/api/posts/' + postId);
  // }
  //
  // // postComment(id, comment) {
  // //   const postData = {
  // //     id: id,
  // //     comment: comment
  // //   };
  // //   return this.http.post('http://localhost:3000/api/posts/comment/' + id, postData);
  // // }
  //
  // likePost(id) {
  //   // @ts-ignore
  //   return this.http.put( 'http://localhost:3000/api/posts/likePost/' + id);
  // }
  //
  // dislikePost(id) {
  //   // @ts-ignore
  //   return this.http.put( 'http://localhost:3000/api/posts/dislikePost/' + id);
  // }
  //
  // addComment(id, comment) {
  //   const postdata = {
  //     id: id,
  //     comment: comment
  //   };
  //   // @ts-ignore
  //   return this.http.put( 'http://localhost:3000/api/posts/comment/' + id, postdata);
  // }
}
