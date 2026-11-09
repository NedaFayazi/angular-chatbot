import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject, OnInit,
  signal,
  viewChild
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { email, form, FormField, FormRoot, minLength, required, validate } from '@angular/forms/signals';

import { authErrorMessage } from '../auth-error-message';
import { AuthService } from '../auth-service';
import { SignUpForm } from '../model/sign-up-form';
import { visibleError } from '../visible-error';
import { UserMessagesService } from '../../shared/user-messages/user-messages-service';
import { UserProfileService } from '../../shared/user-profile/user-profile-service';

const SIGN_UP_ERROR_FALLBACK =
  'We could not create your account. Please try again in a few seconds.';

@Component({
  selector: 'sign-up',
  imports: [NgOptimizedImage, RouterLink, FormField, FormRoot],
  templateUrl: './sign-up.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUp implements OnInit {
  readonly googleButton = viewChild.required<ElementRef<HTMLElement>>('googleButton');
  private readonly authService = inject(AuthService);
  private readonly userMessages = inject(UserMessagesService);
  protected readonly passwordVisible = signal(false);
  protected readonly confirmPasswordVisible = signal(false);
  protected readonly emailError = computed(() => visibleError(this.signUpForm.email()));
  protected readonly passwordError = computed(() => visibleError(this.signUpForm.password()));
  private readonly signUpModel = signal<SignUpForm>({
    email: '',
    password: '',
    confirmPassword: '',
  });

  btnRender = afterNextRender(() => {
    const btn = this.googleButton()
    if(btn) {
      this.authService.renderGoogleButton(btn!.nativeElement);}
  })

  ngOnInit(): void {
    this.authService.initializeGoogleSignIn()
  }

  protected readonly signUpForm = form(
    this.signUpModel,
    (path) => {
      required(path.email, { message: 'Email is required' });
      email(path.email, { message: 'Enter a valid email address' });

      required(path.password, { message: 'Password is required' });
      minLength(path.password, 8, { message: 'Use at least 8 characters' });

      required(path.confirmPassword, { message: 'Please confirm your password' });
      validate(path.confirmPassword, (context) => {
        const confirmation = context.value();
        if (!confirmation || confirmation === context.valueOf(path.password)) {
          return undefined;
        }
        return { kind: 'passwordMismatch', message: 'Passwords do not match' };
      });
    },
    {
      submission: {
        action: async () => {
          try {
            const credentials = this.signUpModel();
            const { user, token } = await this.authService.createUser({
              email: credentials.email,
              password: credentials.password,
            });
            await this.authService.setSession(user, token);
          } catch (error) {
            this.userMessages.showError(authErrorMessage(error, SIGN_UP_ERROR_FALLBACK));
          }
        },
      },
    },
  );


  protected readonly confirmPasswordError = computed(() =>
    visibleError(this.signUpForm.confirmPassword()),
  );

  protected togglePasswordVisibility() {
    this.passwordVisible.update((visible) => !visible);
  }

  protected toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible.update((visible) => !visible);
  }
}
