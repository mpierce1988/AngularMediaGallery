import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { User } from '../models/user.model';
import { LoginResponse } from '../models/graphqlresponse.model';

// This service provides methods related to authentication
@Injectable({
  providedIn: 'root'
})
export class AuthService {  
  // URL endpoint for the GraphQL API
  private apiUrl = 'http://localhost:8080/v1/graphql';

  // Default headers for HTTP requests
  private headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('X-Appwrite-Project', '64c588b8b4f092464391');

  // Inject HttpClient into the service
  constructor(private http: HttpClient) { }

  /**
   * Registers a new user
   * @param email New user's email address
   * @param password New user's password
   * @returns Observable of the HTTP response
   */
  register(email: String, password: String): Observable<any> {
    // GraphQL mutation for creating a new account
    const query = `
      mutation {
        accountCreate(userId: "unique()", email: "${email}", password: ${password}) {
          _id
          email
          name
        }
      }      
    `;

    // Execute the HTTP Post request
    return this.http.post(this.apiUrl, { query }, { headers: this.headers });
  }

   /**
    * Login an existing user
    * @param email User's email address
    * @param password User's password
    * @returns Observable of the HTTP response
    */
  login(email: String, password: String): Observable<LoginResponse> {
    // const query = `
      // mutation {
      //   accountCreateEmailSession(email:"${email}", password: "${password}") {
      //     _id
      //     userId
      //     provider
      //     expire
      //   }
    // `;
    const query = {
      "query": "mutation CreateSession($email: String!, $password: String!){ accountCreateEmailSession(email: $email, password: $password) { _id userId provider expire } }",
      "variables": {
        "email": email,
        "password": password
      }
    }

    return this.http.post<LoginResponse>(this.apiUrl, query, { headers: this.headers });
  }

  /**
   * Get's the current user's data
   * @returns Observable of the current User object
   */
  getCurrentUser():Observable<User> {
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

    const result = this.http.post(this.apiUrl, { query }, { headers: this.headers})
      .pipe(
        // transform the response into a User object
        map((res: any) => {
          if(res && res.data && res.data.accountGet){
            return new User(res.data.accountGet._id, res.data.accountGet.name, res.data.accountGet.email, []);
          } else if (res && res.data && res.data.errors) {
            return new User('', '', '', res.data.errors);
          } else {
            return new User('', '', '', ["Could not fetch the current user"]);
          }
          
        }),
        // Handle errors in the request
        catchError((err) => {
          console.error('Error fetching the current user: ', err);
          return of(new User('', '', '', ["Could not fetch the current user"]));
        })
      );
      
      return result;
  }

  /**
   * Check if the user is logged in
   * @returns Observable of a boolean representing if the User is logged in
   */
  isLoggedIn(): Observable<boolean> {
    // Create graphql query to getSession
    const query = `
      query GetUser {
        accountGet {
          _id
          email
        }
      } `;

      return this.http.post(this.apiUrl, { query: query }, { headers: this.headers, withCredentials: true })
        .pipe(
          map((res: any) => {
            if(!res || !res.data || !res.data.email) {
              return false;
            }

            // User was returned, so they are logged in
            return true;
          })
        );
  }
  
}
