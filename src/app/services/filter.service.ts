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
    this.updateFilter$ = 
      this.languageFilter.asObservable();
    
    this.updateFilter2$ =
      this.eraFilter.asObservable();

      this.updateFilter3$ =
      this.textFilter.asObservable();
  }

  updateFilter(language: string){
    this.languageFilter.next(language);
  }

  updateFilter2(era: string){
    console.log("triggered !!!!!!!!");
    this.eraFilter.next(era);
  }

  updateFilter3(textFilter: any){
    this.textFilter.next(textFilter);
  }
}
