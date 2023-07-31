import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';
import { User } from '../models/user.model';
import { LoginResponse, RegisterResponse } from '../models/graphqlresponse.model';
import { Client, Account, ID } from 'appwrite';

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

  // Show loggedIn status using BehaviourSubject
  private loggedIn = new BehaviorSubject<boolean>(false);
  loggedIn$ = this.loggedIn.asObservable();

  // Inject HttpClient into the service
  constructor(private http: HttpClient) { }

  /**
   * Registers a new user
   * @param email New user's email address
   * @param password New user's password
   * @returns Observable of the HTTP response
   */
  register(email: String, password: String): Observable<RegisterResponse> {
    // GraphQL mutation for creating a new account
    // const query = `
    //   mutation {
    //     accountCreate(userId: "unique()", email: "${email}", password: ${password}) {
    //       _id
    //       email
    //       name
    //     }
    //   }      
    // `;

    const query = {
      "query": "mutation CreateAccount($email: String!, $password: String!){ accountCreate(userId: \"unique()\", email: $email, password: $password) { _id email name } }",
      "variables": {
        "email": email,
        "password": password
      }
    }

    // Execute the HTTP Post request
    return this.http.post<RegisterResponse>(this.apiUrl, query, { headers: this.headers });
  }

   /**
    * Login an existing user
    * @param email User's email address
    * @param password User's password
    * @returns Observable of the HTTP response
    */
  login(email: string, password: string): Observable<LoginResponse> {
    // const query = `
      // mutation {
      //   accountCreateEmailSession(email:"${email}", password: "${password}") {
      //     _id
      //     userId
      //     provider
      //     expire
      //   }
    // `;


    // const query = {
    //   "query": "mutation CreateSession($email: String!, $password: String!){ accountCreateEmailSession(email: $email, password: $password) { _id userId provider expire } }",
    //   "variables": {
    //     "email": email,
    //     "password": password
    //   }
    // }

    // return this.http.post<LoginResponse>(this.apiUrl, query, { headers: this.headers });

    const client = new Client();
    const account = new Account(client);
    client.setEndpoint('http://localhost:8080/v1').setProject('64c588b8b4f092464391');

    //const promise =  account.createEmailSession(email, password);

    return new Observable<LoginResponse>((observer) => {
      account.createEmailSession(email, password).then((response) => {
        this.loggedIn.next(true);
        observer.next({
          data: {
            accountCreateEmailSession: response
          }
        });
      }).catch((error) => {
        this.loggedIn.next(false);
        observer.next({          
          errors: [{
            message: error.message,
            extensions: {
              category: 'internal'
            },
            locations: [],
            path: []
          }]
        });
      });
    });
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
    
    const client = new Client();
    const account = new Account(client);

    client.setEndpoint('http://localhost:8080/v1').setProject('64c588b8b4f092464391');

    return new Observable<boolean>((observer) => {
      account.get().then((response) => {
        console.log(response);
        this.loggedIn.next(true);
        observer.next(true);        
      }).catch((error) => {
        console.log(error);
        this.loggedIn.next(false);
        observer.next(false);
      });
    });
  }

  logout(): Observable<boolean> {

    const client = new Client();
    const account = new Account(client);

    client.setEndpoint('http://localhost:8080/v1').setProject('64c588b8b4f092464391');

    return new Observable<boolean>((observer) => {
      account.deleteSession('current').then((response) => {
        this.loggedIn.next(false);
        observer.next(true);        
      }).catch((error) => {
        observer.next(false);
      });
    });
  }
  
}
