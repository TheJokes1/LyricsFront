import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { debounceTime, Observable, startWith, switchMap } from 'rxjs';
import { FilterService } from '../services/filter.service';

interface Language {
  value: string;
  viewValue: string;
}

interface Era {
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
  url: string;
  selectedLanguage : string = "";
  selectedEra : any = "";
  panelOpenState: boolean = false;
  noFilter: boolean = true;
  textFilter: string = "";
  form = new FormControl('');
  result: any;

  languageList: Language[] = [{value:"", viewValue: "----"}, 
    {value: 'eng', viewValue: "ENG"}, 
    {value: 'fra', viewValue: "FRA"},
    {value: 'nld', viewValue: "NLD"},
    {value: 'spa', viewValue: "ESP"}];

  eraList: Era[] = [{value:"", viewValue: "----"},
    {value: '60', viewValue: "1960's"},
    {value: '70', viewValue: "1970's"},
    {value: '80', viewValue: "1980's"},
    {value: '90', viewValue: "1990's"},
    {value: '00', viewValue: "2000's"},
    {value: '10', viewValue: "2010's"},
    {value: '20', viewValue: "2020's"}];

  constructor(private filterService: FilterService) { 
     }
  
  onSelection(lang: string){
    this.filterService.updateFilter(lang);
    //this.accordion.closeAll();
    // if (this.selectedLanguage != "" && this.selectedEra != ""){
    //   this.noFilter = false;
    // } else this.noFilter = true;
  }

  onSelection2(era: string){
    this.filterService.updateFilter2(era);
    //this.accordion.closeAll();
    // if (this.selectedEra != "" && this.selectedLanguage != ""){
    //   this.noFilter = false;
    // } else this.noFilter = true;
  }

  onTextInput(event: any){
    this.filterService.updateFilter3(event.target.value);
    // if (text != ""){
    //   this.noFilter = false;
    // } else this.noFilter = true;
  }

  closeOnSelection(){
    this.panelOpenState = false;
  }
}
