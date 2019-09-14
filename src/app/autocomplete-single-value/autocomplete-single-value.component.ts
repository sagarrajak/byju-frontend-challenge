import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Helper } from '../helper';
import { ISearchNode } from '../main/search-service.service';


export interface iValidator {
  name: string;
  message: string;
}

export interface Option {
  value: any;
  viewValue: string;
}

/**
 *  The 'formControl' of AutoComplete do not contain 'primary key',
 *  It contains 'Option { value: string, viewValue: string}'  so make sure to convert it before sending to server
 *  and convert back to 'Option' object after receving from server
 */
export interface AutoCompleteSingleValueParams {
  control: string;
  group: FormGroup;
  strictMode: boolean; // only allow to enter using selection mode
  name: string;
  id: string;
  validations: iValidator[];
  placeholder?: string;
  ngIf?: boolean;
  required?: boolean;
  hintMessage?: string;
}

/**
 * Component class for autocompleting single value
 */
@Component({
  selector: 'test-autocomplete-single-value',
  templateUrl: './autocomplete-single-value.component.html',
  styleUrls: ['./autocomplete-single-value.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteSingleValueComponent extends Helper implements OnDestroy {
  @Input('controlsValues') values: AutoCompleteSingleValueParams;
  @Input('trie') search: any = null;
  @ViewChild(MatAutocompleteTrigger, { static: false }) autocomplete: MatAutocompleteTrigger;
  public filteredOptions: Observable<String[]>;

  constructor(public er: ElementRef, private cf: ChangeDetectorRef) {
    super();
    let that = this;
    this.er.nativeElement.addEventListener('focusout', () => {
      that.checkValidInput();
    });
  }

  ngOnInit(): void {
    this.filteredOptions = this.values.group
      .get(this.values.control)
      .valueChanges.pipe(
        startWith<string>(''),
        map(value => this._filter(value))
      );
    // if(this.values && this.values.api) {
    //   this.loadData(this.values.api.url, this.values.api.mapFunction)
    // }
    if (this.values) {
      this.subscriptions.push(this.values.group.get(this.values.control).statusChanges.subscribe((_) => {
        if (this.values.group.get(this.values.control).invalid) {
          this.cf.detectChanges();
        }
      }));
    }
  }

  private _filter(value: string): string[] {
    const searchValue = (value || '').trim().toLowerCase();
    if (this.search) {
      return this.search.get(searchValue).map(({ value }) => value.node); 
    }
    else return [];
  }

  /**
   * this function is call to 
   * check if user input must
   * be selected from drop down
   * in strict mode
   * this function is still not functional properly 
   * thus you must check before form submission that value of formControl must not be string
   * it must be Option object 
   */
  private checkValidInput(): void {
    const autoCompleteFormControl: AbstractControl = this.values.group.get(
      this.values.control
    );
    if (this.values.strictMode) {
      let value: string | Option | undefined | null = autoCompleteFormControl.value;
      if (typeof value === 'string' && !this.autocomplete.panelOpen) { // check if focus is out and panel is close
        autoCompleteFormControl.setValue('');
        this.cf.detectChanges();
      }
    }
  }
  
  ngOnDestroy(): void {
    this.clearMemory();
  }


}
