import { Component, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
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
  @ViewChild(MatAccordion) accordion: MatAccordion;
  title: string;
  inRandoms: boolean = false;
  url: string;
  selectedLanguage : string = "";
  panelOpenState: boolean = false;
  noFilter: boolean = true;

  languageList: Language[] = [{value:"", viewValue: "----"}, 
    {value: 'eng', viewValue: "ENG"}, 
    {value: 'fra', viewValue: "FRA"},
    {value: 'nld', viewValue: "NLD"},
    {value: 'spa', viewValue: "ESP"}];

  constructor(private filterService: FilterService) { 
  }
  
  onSelection(lang: string){
    this.filterService.updateFilter(lang);
    //this.accordion.closeAll();
    if (this.selectedLanguage != ""){
      this.noFilter = false;
    } else this.noFilter = true;
  }

  closeOnSelection(){
    this.panelOpenState = false;
  }

}
