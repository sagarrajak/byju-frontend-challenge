import { FormGroup } from '@angular/forms';
import { AutoCompleteParams } from '../autocomplete-single-value/autocomplete-single-value.component';
export class Search {
    public static getAutoComplete(group: FormGroup): { [key: string]: AutoCompleteParams } {
        return {
            'expirence': {
                control: 'expirence',
                group,
                ngIf: true,
                strictMode: true, // only allow to enter using selection mode
                name: 'expirence',
                id: 'expirence',
                validations: [],
                placeholder: 'Expirence',
            },
            'location': {
                control: 'location',
                group,
                ngIf: true,
                strictMode: true, // only allow to enter using selection mode
                name: 'location',
                id: 'location',
                validations: [],
                placeholder: 'Location',
            },
            'skills': {
                control: 'skills',
                group,
                ngIf: true,
                strictMode: true, // only allow to enter using selection mode
                name: 'skills',
                id: 'skills',
                validations: [],
                placeholder: 'Skills',
            },
        }
    }
}