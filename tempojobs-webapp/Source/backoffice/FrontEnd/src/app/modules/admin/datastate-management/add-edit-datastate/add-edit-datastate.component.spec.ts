import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditDatastateComponent } from './add-edit-datastate.component';

describe('AddEditDatastateComponent', () => {
  let component: AddEditDatastateComponent;
  let fixture: ComponentFixture<AddEditDatastateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditDatastateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditDatastateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
