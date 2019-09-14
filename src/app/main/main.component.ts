import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IJobType } from './types';
import { SearchServiceService } from './search-service.service';
import { Search } from './dataset';
import { AutoCompleteParams } from '../autocomplete-single-value/autocomplete-single-value.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  public isApiCallInProgress: boolean = false;
  public jobFetched: IJobType[] = [];
  public skilesDataset: string[] = [];
  public dataset: { [key: string]: AutoCompleteParams } = {};

  //expirence or location or skill to search jobs
  public searchForm = new FormGroup({
    expirence: new FormControl(''),
    location: new FormControl(''),
    skills: new FormControl('')
  });


  constructor(
    private http: HttpClient,
    public searchService: SearchServiceService
  ) {
    this.dataset = Search.getAutoComplete(this.searchForm);
  }

  ngOnInit() {
    this.isApiCallInProgress = true;
    this.http.get('https://nut-case.s3.amazonaws.com/jobs.json').subscribe((res: { data: IJobType[] }) => {
      this.isApiCallInProgress = false;
      this.jobFetched = res.data;
      this.searchService.fetchedData = res.data;
      this.searchService.createSkillesMap(res.data);
      this.searchService.createLocationMap(res.data);
      this.searchService.createExpirenceMap(res.data);
      console.log(res.data.length)
    }, _err => {
      this.isApiCallInProgress = false;
      this.jobFetched = [];
    });
  }

  public form(str: string): AutoCompleteParams {
    return this.dataset[str];
  }

  public submit(): void {
    const expirence: number = this.searchForm.value['expirence'] ? this.searchForm.value['expirence']['value'] : null;
    const location: string = this.searchForm.value['location'] ? this.searchForm.value['location']['value'] : null;
    const skills: string = this.searchForm.value['skills'] ? this.searchForm.value['skills']['value'] : null;
    const finalArray = [];
    const findalResult = {};

    if (expirence) {
      this.searchService.globalExperienceMap[+expirence].ind.forEach((key: number) => {
        if (!findalResult[key]) finalArray.push(this.searchService.fetchedData[key]);
      });
    }
    if (location && !expirence)
      this.searchService.globalLocationMap[location].ind.forEach((key: number) => {
        if (!findalResult[key]) finalArray.push(this.searchService.fetchedData[key]);
      });
    if (skills && !location && !expirence) {
      this.searchService.globalSkillesMap[skills].ind.forEach((key: number) => {
        if (!findalResult[key]) finalArray.push(this.searchService.fetchedData[key]);
      });
    }
    this.jobFetched = finalArray;
    //console.log(this.jobFetched);
  }

  private mergeTwoArray() {}

  private threeArray() {}


}
