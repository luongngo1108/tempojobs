import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWorkComponent } from './create-work.component';

describe('CreateWorkComponent', () => {
  let component: CreateWorkComponent;
  let fixture: ComponentFixture<CreateWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateWorkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
