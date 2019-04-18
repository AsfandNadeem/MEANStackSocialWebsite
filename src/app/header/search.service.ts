import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
const BASEUURL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  // clientID = 'PAST YOUR CLIENT ID';
  // baseUrl: string = 'https://api.spotify.com/v1/search?type=artist&limit=10&client_id=' + this.clientID + '&q=';

  constructor(private _http: HttpClient) { }

  search(queryString: string) {
    // const _URL = ;
    // + queryString;
    const queryParams = `?user=${queryString}`;
    return this._http.get(`${BASEUURL}/api/user/` + queryParams);

  }
}
