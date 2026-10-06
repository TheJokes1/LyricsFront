import { Injectable } from '@angular/core';
import { AuthResponse, createClient, Session, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject, distinctUntilChanged, map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly client: SupabaseClient | null;
  private readonly userSubject = new BehaviorSubject<User | null>(null);
  private readonly readySubject = new BehaviorSubject<boolean>(false);

  readonly user$ = this.userSubject.asObservable();
  readonly isReady$ = this.readySubject.asObservable();
  readonly isAuthenticated$ = this.user$.pipe(
    map(user => user !== null),
    distinctUntilChanged()
  );

  constructor() {
    this.client = this.isConfigured
      ? createClient(environment.supabaseUrl, environment.supabaseAnonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
          }
        })
      : null;

    if (this.client) {
      this.client.auth.onAuthStateChange((_event, session) => {
        this.setSession(session);
      });
      void this.restoreSession();
    } else {
      this.readySubject.next(true);
    }
  }

  get isConfigured(): boolean {
    return environment.supabaseUrl.startsWith('https://')
      && environment.supabaseUrl.includes('.supabase.co')
      && this.isPublicKey(environment.supabaseAnonKey);
  }

  signUp(email: string, password: string): Promise<AuthResponse> {
    return this.requireClient().auth.signUp({ email, password });
  }

  signIn(email: string, password: string): Promise<AuthResponse> {
    return this.requireClient().auth.signInWithPassword({ email, password });
  }

  async signOut(): Promise<void> {
    const { error } = await this.requireClient().auth.signOut();
    if (error) {
      throw error;
    }
    this.userSubject.next(null);
  }

  private async restoreSession(): Promise<void> {
    try {
      const { data, error } = await this.requireClient().auth.getSession();
      if (error) {
        throw error;
      }
      this.setSession(data.session);
    } catch (error) {
      console.error('Unable to restore the Supabase session:', error);
    } finally {
      this.readySubject.next(true);
    }
  }

  private setSession(session: Session | null): void {
    this.userSubject.next(session?.user ?? null);
    this.readySubject.next(true);
  }

  private isPublicKey(key: string): boolean {
    if (key.startsWith('sb_secret_') || key.length === 0) {
      return false;
    }
    if (key.startsWith('sb_publishable_')) {
      return true;
    }

    const tokenParts = key.split('.');
    if (tokenParts.length !== 3) {
      return false;
    }
    try {
      const payload = JSON.parse(atob(tokenParts[1].replace(/-/g, '+').replace(/_/g, '/')));
      return payload.role === 'anon';
    } catch {
      return false;
    }
  }

  private requireClient(): SupabaseClient {
    if (!this.client) {
      throw new Error('Supabase Auth is not configured. Set the public Supabase URL and anon key in the Angular environment files.');
    }
    return this.client;
  }
}
