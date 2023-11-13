import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditWorkComponent } from './add-edit-work.component';

describe('AddEditWorkComponent', () => {
  let component: AddEditWorkComponent;
  let fixture: ComponentFixture<AddEditWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditWorkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
