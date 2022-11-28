import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  updateFilter$: Observable<any>;
  private languageFilter = new Subject<any>();

  constructor() { 
    this.updateFilter$ = this.languageFilter.asObservable();
  }

  updateFilter(language: string){
    console.log(language);
    this.languageFilter.next(language);
  }

}
