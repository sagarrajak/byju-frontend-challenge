import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IJobType } from './types';
import { SearchServiceService } from './search-service.service';
import { AutoCompleteSingleValueParams } from '../autocomplete-single-value/autocomplete-single-value.component';
import { Search } from './dataset';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  public isApiCallInProgress: boolean = false;
  public jobFetched: IJobType[] = [];
  public skilesDataset: string[] = [];
  public dataset: { [key: string]: AutoCompleteSingleValueParams } = {};

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
      this.searchService.createSkillesMap(res.data);
      this.searchService.createLocationMap(res.data);
      this.searchService.createExpirenceMap(res.data);
    }, _err => {
      this.isApiCallInProgress = false;
      this.jobFetched = [];
    });
  }

  public search(): void {

  }

  public form(str: string): AutoCompleteSingleValueParams {
    return this.dataset[str];
  }
}
