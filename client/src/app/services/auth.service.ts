import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'GRAPHQL_API_URL';
  private headers = new HttpHeaders()
    .set('Content-Type', 'application/graphql')
    .set('X-Appwrite-Project', '64c588b8b4f092464391');

  constructor(private http: HttpClient) { }

  register(email: String, password: String): Observable<any> {
    const query = `
      mutation {
        accountCreate(userId: "unique()", email: "${email}", password: ${password}) {
          _id
          email
          name
        }
      }      
    `;

    return this.http.post(this.apiUrl, { query }, { headers: this.headers });
  }

  login(email: String, password: String): Observable<any> {
    const query = `
      mutation {
        accountCreateEmailSession(email:"${email}", password: "${password}") {
          _id
          userId
          provider
          expire
        }
    `;

    return this.http.post(this.apiUrl, { query }, { headers: this.headers });
  }

  getCurrentUser() {
    const query = `
      query {
        accountGet {
          _id
          email
          name
          status
        }
      }
    `;

    return this.http.post(this.apiUrl, { query }, { headers: this.headers});
  }
}
