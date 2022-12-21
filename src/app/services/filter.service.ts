import { Injectable } from '@angular/core';
import { Observable, shareReplay, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  updateFilter$: Observable<any>;
  updateFilter2$: Observable<any>;
  updateFilter3$: Observable<any>;
  private languageFilter = new Subject<any>();
  private eraFilter = new Subject<any>();
  private textFilter = new Subject<any>();

  constructor() { 
    console.log("in filter service constructor");
    this.updateFilter$ = 
      this.languageFilter.asObservable();
      //.pipe(shareReplay(1));
    
    this.updateFilter2$ =
      this.eraFilter.asObservable();
      //.pipe(shareReplay(1));

      this.updateFilter3$ =
      this.textFilter.asObservable();
  }

  updateFilter(language: string){
    this.languageFilter.next(language);
  }

  updateFilter2(era: string){
    this.eraFilter.next(era);
  }

  updateFilter3(textFilter: string){
    this.textFilter.next(textFilter);
  }
}
