import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RichInlineEditComponent } from './rich-inline-edit.component';

describe('RichInlineEditComponent', () => {
  let component: RichInlineEditComponent;
  let fixture: ComponentFixture<RichInlineEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RichInlineEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RichInlineEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
