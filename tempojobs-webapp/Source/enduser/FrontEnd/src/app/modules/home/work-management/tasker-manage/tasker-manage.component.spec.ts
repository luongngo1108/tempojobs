import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskerManageComponent } from './tasker-manage.component';

describe('TaskerManageComponent', () => {
  let component: TaskerManageComponent;
  let fixture: ComponentFixture<TaskerManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskerManageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskerManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
