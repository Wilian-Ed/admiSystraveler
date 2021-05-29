import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment as env} from '../environments/environment';

@Injectable()
export class UserService {

  // http options used for making API calls
  private httpOptions: any;

  // the actual JWT token
  public _token: string | undefined;

  // the token expiration date
  // the token expiration date

  public token_expires!: Date;

  // the username of the logged in user
  public username: string | undefined;

  // error messages received from the login attempt
  public errors: any = [];

  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }

  // Uses http.post() to get an auth token from djangoRestFramework-jwt endpoint
  public login = (user: { username: any; password: any; grant_type: any; }) => {
    this.http.post(env.apiUrl + '/auth/token', JSON.stringify(user), this.httpOptions).subscribe(
      data => {
        // this.updateData(data['token']);
        // @ts-ignore
        // this.updateData(data.token);
        this.updateData(data['access_token'])
      },
      err => {
        this.errors = err['error'];
      }
    );
  };

  // Refreshes the JWT token, to extend the time the user is logged in
  public refreshToken() {
    this.http.post(env.apiUrl + '/auth/token', JSON.stringify({token: this._token}), this.httpOptions)
      .subscribe(
        data => {
          // @ts-ignore
          this.updateData(data.token);
        },
        err => {
          this.errors = err['error'];
        }
      );
  }

  public logout() {
    // @ts-ignore
    this._token = null;
    // @ts-ignore
    this.token_expires = null;
    // @ts-ignore
    this.username = null;
  }

  private updateData(token: string | undefined) {
    this._token = token;
    this.errors = [];

    // decode the token to read the username and expiration timestamp
    // @ts-ignore
    const token_parts = this._token.split(/\./);
    const token_decoded = JSON.parse(window.atob(token_parts[1]));
    this.token_expires = new Date(token_decoded.exp * 1000);
    this.username = token_decoded.username;
  }

  public getData(token: any): any {

    console.log('call get data')
    this.httpOptions.headers = new HttpHeaders({'Authorization': 'Bearer ' + token})
    this.http.get(env.apiUrl + '/api/bitacoras/', this.httpOptions)
      .subscribe(
        response => {
          console.log(response)
          return response;
        }
      )
  }
}
