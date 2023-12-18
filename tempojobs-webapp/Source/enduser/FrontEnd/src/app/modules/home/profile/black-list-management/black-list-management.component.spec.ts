import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlackListManagementComponent } from './black-list-management.component';

describe('BlackListManagementComponent', () => {
  let component: BlackListManagementComponent;
  let fixture: ComponentFixture<BlackListManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlackListManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlackListManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
