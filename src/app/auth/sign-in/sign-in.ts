import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject, OnInit,
  signal,
  viewChild
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { email, form, FormField, FormRoot, required } from '@angular/forms/signals';

import { authErrorMessage } from '../auth-error-message';
import { AuthService } from '../auth-service';
import { SignInForm } from '../model/sign-in-form';
import { visibleError } from '../visible-error';
import { UserMessagesService } from '../../shared/user-messages/user-messages-service';
import { UserProfileService } from '../../shared/user-profile/user-profile-service';

const SIGN_IN_ERROR_FALLBACK = 'We could not sign you in. Please try again in a few seconds.';

@Component({
  selector: 'sign-in',
  imports: [NgOptimizedImage, RouterLink, FormField, FormRoot],
  templateUrl: './sign-in.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignIn implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly userProfileService = inject(UserProfileService);
  private readonly userMessages = inject(UserMessagesService);
  private readonly router = inject(Router);
  protected readonly googleButton = viewChild.required<ElementRef<HTMLElement>>('googleButton');
  protected readonly passwordVisible = signal(false);
  private readonly signInModel = signal<SignInForm>({ email: '', password: '' });
  protected readonly emailError = computed(() => visibleError(this.signInForm.email()));
  protected readonly passwordError = computed(() => visibleError(this.signInForm.password()));

  btnRender = afterNextRender(() => {
    const btn = this.googleButton()
    if(btn) {
      this.authService.renderGoogleButton(btn!.nativeElement);}
  })

  ngOnInit(): void {
    this.authService.initializeGoogleSignIn()
  }


  protected readonly signInForm = form(
    this.signInModel,
    (path) => {
      required(path.email, { message: 'Email is required' });
      email(path.email, { message: 'Enter a valid email address' });
      required(path.password, { message: 'Password is required' });
    },
    {
      submission: {
        action: async () => {
          try {
            const { user, token } = await this.authService.signIn(this.signInModel());

            this.authService.storeToken(token);
            this.userProfileService.setProfile(user, token);
            await this.router.navigate(['/home']);
          } catch (error) {
            this.userMessages.showError(authErrorMessage(error, SIGN_IN_ERROR_FALLBACK));
          }
        },
      },
    },
  );

  protected togglePasswordVisibility() {
    this.passwordVisible.update((visible) => !visible);
  }
}
