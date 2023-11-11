import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datePipe'
})
export class DatePipePipe implements PipeTransform {
  transform(value: string) {
    var datePipe = new DatePipe("en_SG");
     value = datePipe.transform(value, 'dd/MM/yyyy');
     return value;
 }

}
