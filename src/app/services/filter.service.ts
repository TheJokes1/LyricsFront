import { Injectable } from '@angular/core';
import { Observable, shareReplay, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  languageFilter = new Subject<any>();
  eraFilter = new Subject<any>();
  textFilter = new Subject<any>();

  constructor() { 
  }

  updateFilter(language: string){
    this.languageFilter.next(language);
  }

  updateFilter2(era: string){
    this.eraFilter.next(era);
  }

  updateFilter3(data: any){
    this.textFilter.next(data);
  }
}
