import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'PreserveOrder',
})
export class PreserveOrderPipe implements PipeTransform {
    transform(value: any, excludeKeys: string[] = [], ...args: any[]): any {
        if (!value) {
            return [];
        }

        let pipeResponse = {};
        for (const key in value) {
            if (excludeKeys.indexOf(key) === -1) {
                pipeResponse[key] = value[key];
            }
        }
        // console.log('pipeResponse:', pipeResponse);
        return Object.keys(pipeResponse).map((key) => ({
            key,
            value: value[key],
        }));
    }
}

@Pipe({
    name: 'ObjectValues',
    standalone: true,
})
export class KeysValuesPipe implements PipeTransform {
    transform(arrObj: any, ...args: any[]): any {
        if (!arrObj && !Array.isArray(arrObj)) {
            return [];
        }
        return arrObj.map((obj: any) => {
            return Object.values(obj).map((v) => {
                return v;
            });
        });
    }
}
