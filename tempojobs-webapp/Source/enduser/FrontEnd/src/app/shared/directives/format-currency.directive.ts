import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appFormatCurrency]'
})
export class FormatCurrencyDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    // Remove non-digit characters
    const cleanValue = value.replace(/[^0-9]/g, '');

    // Format the value with commas and currency symbol
    const formattedValue = this.formatCurrency(cleanValue);

    // Set the formatted value back into the input field
    this.el.nativeElement.value = formattedValue;
  }

  formatCurrency(value: string): string {
    // Convert the string to a number
    const numberValue = Number(value);

    // Format the number as currency with "đ" symbol
    const formattedValue = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(numberValue);

    return formattedValue;
  }
}