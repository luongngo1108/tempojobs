import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendDayDialogComponent } from './extend-day-dialog.component';

describe('ExtendDayDialogComponent', () => {
  let component: ExtendDayDialogComponent;
  let fixture: ComponentFixture<ExtendDayDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtendDayDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtendDayDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
