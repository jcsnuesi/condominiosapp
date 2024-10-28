import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'PreserveOrder'
})
export class PreserveOrderPipe implements PipeTransform {
    
    transform(value: any, ...args: any[]): any {
        if (!value) {
            return [];
        }
        return Object.keys(value).map(key => ({ key, value: value[key] }));
    }
}