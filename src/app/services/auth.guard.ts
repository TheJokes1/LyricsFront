import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { combineLatest, filter, map, Observable, take } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return combineLatest([this.authService.isReady$, this.authService.user$]).pipe(
      filter(([ready]) => ready),
      take(1),
      map(([, user]) => user
        ? true
        : this.router.createUrlTree(['/Auth'], { queryParams: { returnUrl: state.url } })
      )
    );
  }
}
