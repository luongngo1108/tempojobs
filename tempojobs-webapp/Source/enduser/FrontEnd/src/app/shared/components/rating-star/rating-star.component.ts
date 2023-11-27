import { Component, ElementRef, Input, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-rating-star',
  templateUrl: './rating-star.component.html',
  styleUrls: ['./rating-star.component.scss']
})
export class RatingStarComponent {
  @Input() rating: number;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    const percentage = Math.round((this.rating / 5) * 100);
    const overlayElement = this.elementRef.nativeElement.querySelector('.overlay');
    this.renderer.setStyle(overlayElement, 'width', `${100 - percentage}%`);
  }
}