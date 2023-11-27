import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingStarComponent } from './rating-star.component';

describe('RatingStarComponent', () => {
  let component: RatingStarComponent;
  let fixture: ComponentFixture<RatingStarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RatingStarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RatingStarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
