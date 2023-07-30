import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'GRAPHQL_API_URL';

  constructor(private http: HttpClient) { }

  register(email: String, password: String): Observable<any> {
    const query = `
      mutation {
        register(email: "${email}", password: "${password}") {
          user {
            id
            username
          }
        }
      }      
    `;

    return this.http.post(this.apiUrl, { query});
  }

  login(email: String, password: String): Observable<any> {
    const query = `
      mutation {
        login(email:"${email}", password: "${password}") {
          user {
            id
            username
          }
        }
    `;

    return this.http.post(this.apiUrl, { query });
  }
}
