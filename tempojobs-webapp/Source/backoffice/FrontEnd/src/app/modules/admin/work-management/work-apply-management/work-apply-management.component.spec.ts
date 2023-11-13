import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkApplyManagementComponent } from './work-apply-management.component';

describe('WorkApplyManagementComponent', () => {
  let component: WorkApplyManagementComponent;
  let fixture: ComponentFixture<WorkApplyManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkApplyManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkApplyManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
