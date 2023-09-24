import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobcreatorPageComponent } from './jobcreator-page.component';

describe('JobcreatorPageComponent', () => {
  let component: JobcreatorPageComponent;
  let fixture: ComponentFixture<JobcreatorPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobcreatorPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobcreatorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
