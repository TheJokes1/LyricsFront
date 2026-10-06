import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { User } from '@supabase/supabase-js';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let ready: BehaviorSubject<boolean>;
  let user: BehaviorSubject<User | null>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    ready = new BehaviorSubject<boolean>(false);
    user = new BehaviorSubject<User | null>(null);
    router = jasmine.createSpyObj<Router>('Router', ['createUrlTree']);
    router.createUrlTree.and.returnValue({} as UrlTree);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        {
          provide: AuthService,
          useValue: {
            isReady$: ready.asObservable(),
            user$: user.asObservable()
          }
        },
        { provide: Router, useValue: router }
      ]
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('waits for session restoration and allows an authenticated user', () => {
    let result: boolean | UrlTree | undefined;
    guard.canActivate({} as ActivatedRouteSnapshot, { url: '/Add' } as RouterStateSnapshot)
      .subscribe(value => result = value);

    expect(result).toBeUndefined();
    user.next({} as User);
    ready.next(true);

    expect(result).toBe(true);
  });

  it('redirects an unauthenticated user to login with the requested route', async () => {
    ready.next(true);
    const state = { url: '/Favorites' } as RouterStateSnapshot;

    await firstValueFrom(guard.canActivate({} as ActivatedRouteSnapshot, state));

    expect(router.createUrlTree).toHaveBeenCalledWith(
      ['/Auth'],
      { queryParams: { returnUrl: '/Favorites' } }
    );
  });
});
