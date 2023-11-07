import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatastateManagementComponent } from './datastate-management.component';

describe('DatastateManagementComponent', () => {
  let component: DatastateManagementComponent;
  let fixture: ComponentFixture<DatastateManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatastateManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatastateManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
