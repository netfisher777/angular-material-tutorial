import {Injectable} from '@angular/core';
import * as auth0 from 'auth0-js';
import {Router} from '@angular/router';

// why do you need defining window as any?
// check this: https://github.com/aws/aws-amplify/issues/678#issuecomment-389106098
(window as any).global = window;

@Injectable()
export class AuthService {

  private EXPIRES_AT = 'expires_at';
  private ACCESS_TOKEN = 'access_token';
  private ID_TOKEN = 'id_token';

  auth0 = new auth0.WebAuth({
    clientID: 'vqDijDMcd0aAnuGh9m3bHy1AezB41hCz',
    domain: 'netfisher777.auth0.com',
    responseType: 'token id_token',
    redirectUri: 'http://localhost:4200/',
    scope: 'openid'
  });

  constructor(public router: Router) {
  }

  public login(): void {
    this.auth0.authorize();
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this.setSession(authResult);
        this.router.navigate(['/dashboard']);
      } else if (err) {
        this.router.navigate(['/']);
        console.log(err);
      }
    });
  }

  public logout(): void {
    localStorage.removeItem(this.ACCESS_TOKEN);
    localStorage.removeItem(this.ID_TOKEN);
    localStorage.removeItem(this.EXPIRES_AT);
    this.router.navigate(['/']);
  }

  private setSession(authResult): void {
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem(this.ACCESS_TOKEN, authResult.accessToken);
    localStorage.setItem(this.ID_TOKEN, authResult.idToken);
    localStorage.setItem(this.EXPIRES_AT, expiresAt);
  }

  public isAuthenticated(): boolean {
    const expiresAt = localStorage.getItem(this.EXPIRES_AT);
    return new Date().getTime() < parseInt(expiresAt, 10);
  }

}
