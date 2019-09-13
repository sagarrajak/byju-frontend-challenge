import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IJobType } from './types';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  public isApiCallInProgress: boolean = false;
  public jobFetched: IJobType[] = [];

  constructor(
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.isApiCallInProgress = true;
    this.http.get('https://nut-case.s3.amazonaws.com/jobs.json').subscribe((res: { data: IJobType[] }) => {
      this.isApiCallInProgress = false;
      this.jobFetched = res.data;
    }, err => {
      this.isApiCallInProgress = false;
      this.jobFetched = [];
    });
  }
}
