import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatedManageComponent } from './created-manage.component';

describe('CreatedManageComponent', () => {
  let component: CreatedManageComponent;
  let fixture: ComponentFixture<CreatedManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatedManageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatedManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
