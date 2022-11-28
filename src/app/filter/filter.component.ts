import { AfterContentChecked, Component, OnInit } from '@angular/core';
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


export class FilterComponent implements AfterContentChecked {
  title: string;
  inRandoms: boolean = false;
  url: string;
  selectedLanguage : string = "";

  languageList: Language[] = [{value: 'eng', viewValue: "ENG"}, 
    {value: 'fra', viewValue: "FRA"},
    {value: 'nld', viewValue: "NLD"}];

  constructor(private filter: FilterService) { 
    this.filter.updateFilter(this.selectedLanguage);
  }
  
  onSelection(lang: Language){
    this.selectedLanguage = lang.value;
  }

  ngAfterContentChecked(): void {
    this.url = window.location.href;
    //if (this.url.endsWith('Random') || (this.url.endsWith("/")))
  }

}
