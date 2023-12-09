import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'findItem'
})
export class FindItemPipe implements PipeTransform {

  transform(value: any, arr: any[] = [], key: string = "id"): any {
    var result: any = null;
    try {
      if (value && arr.length > 0 && key) {
        result = arr.find(x => x[key] == value);
      }
    }
    catch (ex) {
      console.error(ex);
    }
    
    return result;
  }

}
