import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveTaskerDialogComponent } from './approve-tasker-dialog.component';

describe('ApproveTaskerDialogComponent', () => {
  let component: ApproveTaskerDialogComponent;
  let fixture: ComponentFixture<ApproveTaskerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveTaskerDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveTaskerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
