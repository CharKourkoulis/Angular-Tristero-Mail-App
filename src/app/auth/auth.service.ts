import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {tap} from 'rxjs/operators';


interface UsernameAvailableResponse {
  available: boolean;
}

interface SignupCredentials {
  username: string;
  password: string;
  passwordConfirmation: string ;
}

interface SignupResponse {
  username: string;
}

interface SignedinResponse {
  authenticated: boolean;
  username: string;
}

interface SignInCredentials {
  username: string;
  password: string;
}

interface SignInResponse {
  username: string;
}

@Injectable({providedIn: 'root'})
export class AuthService {

  rootUrl = 'https://api.angular-email.com';
  signedin$ = new BehaviorSubject(null);
  username = '';

    constructor(private http: HttpClient) { }


    usernameAvailable(username: string) {
     return this.http.post<UsernameAvailableResponse>(this.rootUrl + '/auth/username', { username });
    }

    signup(credentials: SignupCredentials) {
      return this.http.post<SignupResponse>(this.rootUrl + '/auth/signup', credentials)
              .pipe(
                tap(response => {
                  this.signedin$.next(true);
                  this.username = response.username;
                })
              );
    }

    checkAuth() {
      return this.http.get<SignedinResponse>(this.rootUrl + '/auth/signedin')
              .pipe(
                tap(({authenticated, username}) => {
                    this.signedin$.next(authenticated);
                    this.username = username;
                })
              );
    }

    signOut() {
      return this.http.post(this.rootUrl + '/auth/signout', {})
              .pipe(
                tap(() => {
                  this.signedin$.next(false);
                })
              )
    }

    signIn(signInCredentials: SignInCredentials) {
        return this.http.post<SignInResponse>(this.rootUrl + '/auth/signin', signInCredentials )
                .pipe(
                  tap(response => {
                    this.signedin$.next(true);
                    this.username = response.username;
                  })
                )
    }

}
