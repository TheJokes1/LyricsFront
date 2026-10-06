import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  readonly form: FormGroup;
  isRegistering = false;
  isSubmitting = false;
  errorMessage = '';
  statusMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async submit(): Promise<void> {
    if (this.form.invalid || this.isSubmitting) {
      this.form.markAllAsTouched();
      return;
    }
    if (!this.authService.isConfigured) {
      this.errorMessage = 'Supabase Auth is not configured. Add the public project URL and anon key to the Angular environment files.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.statusMessage = '';

    try {
      const { email, password } = this.form.getRawValue();
      const { data, error } = this.isRegistering
        ? await this.authService.signUp(email, password)
        : await this.authService.signIn(email, password);

      if (error) {
        throw error;
      }
      if (this.isRegistering && !data.session) {
        this.statusMessage = 'Registration successful. Check your email to confirm your account before logging in.';
        return;
      }

      await this.router.navigateByUrl(this.getReturnUrl());
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Authentication failed. Please try again.';
    } finally {
      this.isSubmitting = false;
    }
  }

  toggleMode(): void {
    this.isRegistering = !this.isRegistering;
    this.errorMessage = '';
    this.statusMessage = '';
  }

  private getReturnUrl(): string {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    return returnUrl && returnUrl.startsWith('/') && !returnUrl.startsWith('//')
      ? returnUrl
      : '/';
  }
}
