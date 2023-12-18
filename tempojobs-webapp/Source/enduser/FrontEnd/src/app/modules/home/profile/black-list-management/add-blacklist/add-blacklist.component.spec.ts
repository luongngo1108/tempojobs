import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBlacklistComponent } from './add-blacklist.component';

describe('AddBlacklistComponent', () => {
  let component: AddBlacklistComponent;
  let fixture: ComponentFixture<AddBlacklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBlacklistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBlacklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
