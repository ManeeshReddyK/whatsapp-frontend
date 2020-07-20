import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeactivateaccountComponent } from './deactivateaccount.component';

describe('DeactivateaccountComponent', () => {
  let component: DeactivateaccountComponent;
  let fixture: ComponentFixture<DeactivateaccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeactivateaccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeactivateaccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
