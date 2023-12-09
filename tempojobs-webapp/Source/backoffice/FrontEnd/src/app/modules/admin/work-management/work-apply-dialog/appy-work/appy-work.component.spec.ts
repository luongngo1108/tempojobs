import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppyWorkComponent } from './appy-work.component';

describe('AppyWorkComponent', () => {
  let component: AppyWorkComponent;
  let fixture: ComponentFixture<AppyWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppyWorkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppyWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
