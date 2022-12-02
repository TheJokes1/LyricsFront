import { Component } from '@angular/core';
import { FilterService } from '../services/filter.service';

interface Language {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})


export class FilterComponent{
  title: string;
  inRandoms: boolean = false;
  url: string;
  selectedLanguage : string = "";

  languageList: Language[] = [{value:"", viewValue: "----"}, 
    {value: 'eng', viewValue: "ENG"}, 
    {value: 'fra', viewValue: "FRA"},
    {value: 'nld', viewValue: "NLD"}];

  constructor(private filterService: FilterService) { 
  }
  
  onSelection(lang: string){
    console.log("in FILTER component: ", lang);
    this.filterService.updateFilter(lang);

  }

}
