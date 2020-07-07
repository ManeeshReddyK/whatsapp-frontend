import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'search',
    pure: false
})
export class SearchPipe implements PipeTransform {

    transform(value: any[], searchValue: string, propName: string, subProp: string): any[] {

        if (value.length === 0) {
            return value;
        }
        else {
            let outputArray = [];
            value.forEach(element => {
                if (element[propName][subProp].toLowerCase().startsWith(searchValue.toLowerCase())) {
                    outputArray.push(element);
                }
            })
            return outputArray;
        }

    }
}
