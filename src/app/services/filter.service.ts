import { Injectable } from '@angular/core';
import { Observable, shareReplay, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  updateFilter$: Observable<any>;
  private languageFilter = new Subject<any>();

  constructor() { 
    this.updateFilter$ = 
    this.languageFilter.asObservable()
    .pipe(shareReplay(1));
  }

  updateFilter(language: string){
    this.languageFilter.next(language);
  }

}
