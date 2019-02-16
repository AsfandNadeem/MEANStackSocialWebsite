import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {

  isadmin = false;

  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string) {
    // const authData: AuthData = {email: email, password: password};
    this.http.post<{adminuser: string}>(
      'http://localhost:3000/api/admin/login',
      {email, password})
      .subscribe( response => {
       this.isadmin = true;
        console.log(response);
          this.router.navigate(['/adminpage']).then();
          } , error => {
        this.isadmin = false;
        console.log(this.isadmin);
        this.router.navigate(['/admin']).then();
      });

  }

  getisAdmin() {
    return this.isadmin;
  }
}
