import { FormGroup } from '@angular/forms';
import { AutoCompleteSingleValueParams } from '../autocomplete-single-value/autocomplete-single-value.component';
export class Search {
    public static getAutoComplete(group: FormGroup): { [key: string]: AutoCompleteSingleValueParams } {
        return {
            'expirence': {
                control: 'expirence',
                group,
                strictMode: true, // only allow to enter using selection mode
                name: 'expirence',
                id: 'expirence',
                validations: [],
                placeholder: 'Expirence',
            },
            'location': {
                control: 'location',
                group,
                strictMode: true, // only allow to enter using selection mode
                name: 'location',
                id: 'location',
                validations: [],
                placeholder: 'Location',
            },
            'skills': {
                control: 'skills',
                group,
                strictMode: true, // only allow to enter using selection mode
                name: 'skills',
                id: 'skills',
                validations: [],
                placeholder: 'Skills',
            },
        }
    }
}