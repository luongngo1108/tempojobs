import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobworkerPageComponent } from './jobworker-page.component';

describe('JobworkerPageComponent', () => {
  let component: JobworkerPageComponent;
  let fixture: ComponentFixture<JobworkerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobworkerPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobworkerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
