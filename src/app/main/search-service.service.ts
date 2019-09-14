import { Injectable } from '@angular/core';
import * as TriSearch from 'trie-search';
import { IJobType } from './types';

export interface ISearchNode {
  node: string;
  ind: number[];
}

@Injectable({
  providedIn: 'root'
})
export class SearchServiceService {
  public globalSkillesMap: { [key: string]: ISearchNode } = {};
  public globalLocationMap: { [key: string]: ISearchNode } = {};
  public globalExperienceMap: { [key: number]: number[] } = {};

  public skilessTri: any = null;
  public locationTri: any = null;
  public experienceTri: any = null;

  public createSkillesMap(data: IJobType[]): void {
    this.globalSkillesMap = {};
    data.forEach((job, index) => {
      if (job.skills) {
        job.skills.split(",").map(arr => arr.trim()).forEach(str => {
          const strForMap: string = str.toLowerCase();
          if (strForMap.split(" ").length > 1) {
            str.split(" ").forEach(inner => {
              if (this.globalSkillesMap[inner.trim().toLowerCase()]) {
                this.globalSkillesMap[inner.trim().toLowerCase()].ind.push(index);
              }
              else {
                this.globalSkillesMap[inner.trim().toLowerCase()] = {
                  node: str,
                  ind: [index]
                }
              }
            });
          };
          str.split("/").forEach(inner => {
            if (this.globalSkillesMap[inner.trim().toLowerCase()]) {
              this.globalSkillesMap[inner.trim().toLowerCase()].ind.push(index);
            }
            else {
              this.globalSkillesMap[inner.trim().toLowerCase()] = {
                node: str,
                ind: [index]
              }
            }
          });
          if (this.globalSkillesMap[strForMap])
            this.globalSkillesMap[strForMap].ind.push(index);
          else {
            this.globalSkillesMap[strForMap] = {
              ind: [index],
              node: str
            }
          }
        });
      }
    });
    this.skilessTri = new TriSearch();
    this.skilessTri.addFromObject(this.globalSkillesMap);
    console.log(this.globalSkillesMap);
  }

  public createLocationMap(data: IJobType[]): void {
    this.globalLocationMap = {};
    data.forEach((data, index) => {
      if (data.location) {
        data.location.split("/").join(",").split(" ").join(",").split(",").map(arr => arr.trim()).forEach(str => {
          if (str) {
            const strForMap: string = str.toLowerCase();
            if (this.globalLocationMap[strForMap])
              this.globalLocationMap[strForMap].ind.push(index);
            else {
              this.globalLocationMap[strForMap] = {
                ind: [index],
                node: str
              }
            }
          }
        });
      }
    });
    this.locationTri = new TriSearch();
    this.locationTri.addFromObject(this.globalLocationMap);
  }

  public createExpirenceMap(data: IJobType[]): void {
    data.forEach((job, index) => {
      if (job.experience) {
        const exp = (job.experience.split(" ")[0]).split("-");
        if (exp.length >= 2 && !Number.isNaN(+exp[0]) && !Number.isNaN(+exp[1])) {
          for (let i: number = +exp[0]; i <= +exp[1]; i++) {
            if (this.globalExperienceMap[i]) this.globalExperienceMap[i].push(index);
            else {
              this.globalExperienceMap[i] = [];
              this.globalExperienceMap[i].push(index);
            }
          }
        }
        else {
          for (let i: number = 0; i <= +exp[0]; i++) {
            if (this.globalExperienceMap[i]) this.globalExperienceMap[i].push(index);
            else {
              this.globalExperienceMap[i] = [];
              this.globalExperienceMap[i].push(index);
            }
          }
        }
      }
      else {
        if (this.globalExperienceMap[0]) this.globalExperienceMap[0].push(index);
      }
    });
  }

}
