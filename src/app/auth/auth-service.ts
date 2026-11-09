import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { AuthResponse } from './model/auth-response';
import { SignInForm } from './model/sign-in-form';
import { SignUpCredentials } from './model/sign-up-credentials';
import {authErrorMessage} from './auth-error-message';
import {UserProfileService} from '../shared/user-profile/user-profile-service';
import {UserMessagesService} from '../shared/user-messages/user-messages-service';
import {Router} from '@angular/router';

export const environment = {
  production: false,
  googleClientId: '800985465192-vrmrao4e7k9muqlfp3k3d7gjs3le23qr.apps.googleusercontent.com',
  apiUrl: 'http://localhost:9000/api',
};

const AUTH_TOKEN_STORAGE_KEY = 'auth-token';

@Service()
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly userProfileService = inject(UserProfileService);
  private readonly userMessages = inject(UserMessagesService);
  private readonly router = inject(Router);

  async signIn(credentials: SignInForm) {
    return firstValueFrom(
      this.httpClient.post<AuthResponse>('/api/sign-in', credentials),
    );
  }

  async createUser(credentials: SignUpCredentials) {
    return firstValueFrom(
      this.httpClient.post<AuthResponse>('/api/sign-up', credentials),
    );
  }

  private async googleCredentialResponse(response: GoogleCredentialResponse) {
    return await firstValueFrom(
      this.httpClient.post<AuthResponse>(`${environment.apiUrl}/auth/google`, {
        idToken: response.credential,
      }),
    );
  }

  storeToken(token: string) {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  }

  readToken() {
    return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  }

  clearToken() {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  }

  logout() {
    this.clearToken();
  }

  initializeGoogleSignIn() {
    window.google?.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response) => this.handleCredentialResponse(response),
    });
  }

  renderGoogleButton(buttonElement: HTMLElement) {
    window.google?.accounts.id.renderButton(buttonElement,{
      theme: 'outline',
      size: 'large',
      shape: 'rectangular',
      logo_alignment: 'center',
      locale: 'en',
      width: buttonElement.parentElement?.offsetWidth || 550,
    });
  }

  private async handleCredentialResponse(response: GoogleCredentialResponse) {
    try {
      const { user, token } = await this.googleCredentialResponse(response);
      this.storeToken(token);
      this.userProfileService.setProfile(user, token);
      await this.router.navigate(['/home']);
    } catch (error) {
      this.userMessages.showError(authErrorMessage(error, ''));
    }
  }
}
