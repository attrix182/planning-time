import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParticipantViewService {

  url = 'https://lamercantil.atlassian.net/';

  constructor(private http: HttpClient) { }

  searchIssue(query:string){
    return this.http.get(this.url + 'rest/api/3/issue/picker?query=' + query, 
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Basic Basic bHVjaWFuby5zaW5pc3RlcnJhQGxhbWVyY2FudGlsLmNvbS5hcjpBVEFUVDN4RmZHRjBuWUg0Wl9RQUwtTVc1Q3hhckF6em1JeXl3SUxkTV9PVE9jd20xN0ZhZ1N0c1FoNEhFejBjOWdWcjd0alo3NS1lQ0Y5NjdFb3luRThvbHNKc19FaC1OTF9GNTlzTy0ycjIyRHN4S2pRV3o4aVY2NXpRV08tOGVDUEtOaEpCRWxYS2EyanliblhueU56bEdRdVNYemVUNDM2b1JvVTFLYlExNjZ5YXFNV20tQkU9RDFCNkFCMEM='
        }
      });
  }
}
