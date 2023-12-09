import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkApplyDialogComponent } from './work-apply-dialog.component';

describe('WorkApplyDialogComponent', () => {
  let component: WorkApplyDialogComponent;
  let fixture: ComponentFixture<WorkApplyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkApplyDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkApplyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
