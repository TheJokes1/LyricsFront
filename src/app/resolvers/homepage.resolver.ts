import { Injectable } from "@angular/core";
import { SplashScreenStateService } from "../services/splash-screen-state.service";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { ApiService } from "../services/api.service";

@Injectable()
export class HomepageResolver implements Resolve<any> {
    quote$: any;
    constructor (private apiService: ApiService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
        {
            console.log("SECOND CALL");

            return this.apiService.GetLyric(2);
        }
    
}