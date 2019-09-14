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
  public globalAgeMap: { [key: number]: number[] } = {};

  public skilessTri: any = null;
  public locationTri: any = null;
  public ageTri: any = null;

  public createSkillesMap(data: IJobType[]): void {
    data.forEach((data, index) => {
      if (data.skills) {
        data.skills.split(",").map(arr => arr.trim()).forEach(str => {
          const strForMap: string = str.toLowerCase();
          if (strForMap.split(" ").length > 1) {
            str.split(" ").map(str => str.trim().toLowerCase()).forEach(inner => {
              if (this.globalSkillesMap[inner]) {
                this.globalSkillesMap[inner].ind.push(index);
              }
              else {
                this.globalSkillesMap[inner] = {
                  node: str,
                  ind: [index]
                }
              }
            });
          };
          str.split("/").map(str => str.trim().toLowerCase()).forEach(inner => {
            if (this.globalSkillesMap[inner]) {
              this.globalSkillesMap[inner].ind.push(index);
            }
            else {
              this.globalSkillesMap[inner] = {
                node: str,
                ind: [index]
              }
            }
          });
          if (this.globalSkillesMap[strForMap])
            this.globalSkillesMap[strForMap].ind.push(index);
          else {
            this.globalLocationMap[strForMap] = {
              ind: [index],
              node: str
            }
          }
        });
      }
    });
    this.skilessTri = new TriSearch();
    this.skilessTri.addFromObject(this.globalSkillesMap);
  }

  public createLocationMap(data: IJobType[]): void {

  }

  public createExpirenceMap(data: IJobType[]): void {

  }

}
