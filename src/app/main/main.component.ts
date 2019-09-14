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
    const expirence: string = this.searchForm.value['expirence'] ? this.searchForm.value['expirence']['value'] : null;
    const location: string = this.searchForm.value['location'] ? this.searchForm.value['location']['value'] : null;
    const skills: string = this.searchForm.value['skills'] ? this.searchForm.value['skills']['value'] : null;
    const expirenceIndexMap = expirence ? this.searchService.globalExperienceMap[expirence].ind : null;
    const locationIndexMap = location ? this.searchService.globalLocationMap[location].ind : null;
    const skillesIndexMap = skills ? this.searchService.globalSkillesMap[skills].ind : null;
    this.jobFetched = this.union(expirenceIndexMap, locationIndexMap, skillesIndexMap);
  }

  private union(expirence: number[], location: number[], skills: number[]): IJobType[] {
    if (expirence && location && skills) {
      // if user select three
      return expirence.filter(ind => {
        return location.indexOf(ind) !== -1;
      }).filter(ind => {
        return skills.indexOf(ind) !== -1;
      }).map(ind => {
        return this.searchService.fetchedData[ind];
      });
    }
    else if (
      (!expirence && (location && skills)) ||
      ((expirence && location) && !skills) ||
      (!location && (skills && expirence))
    ) {
      // if user select any two
      if (!expirence) {
        return location.filter(ind => {
          return skills.indexOf(ind) !== -1;
        }).map(ind => {
          return this.searchService.fetchedData[ind];
        });
      }
      else if (!location) {
        return expirence.filter(ind => {
          return skills.indexOf(ind) !== -1;
        }).map(ind => {
          return this.searchService.fetchedData[ind];
        });
      }
      else {
        return expirence.filter(ind => {
          return location.indexOf(ind) !== -1;
        }).map(ind => {
          return this.searchService.fetchedData[ind];
        });
      }
    }
    else if (
      (expirence && !location && !skills) ||
      (!expirence && !location && skills) ||
      (location && !skills && !expirence)
    ) {
      if (expirence) return expirence.map(index => this.searchService.fetchedData[index]);
      if (location) return location.map(index => this.searchService.fetchedData[index]);
      if (skills) return skills.map(index => this.searchService.fetchedData[index]);
      return []
    }
  }


}
