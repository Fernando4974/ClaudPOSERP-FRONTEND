import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmModalComponentComponent } from './confirm-modal-component.component';

describe('ConfirmModalComponentComponent', () => {
  let component: ConfirmModalComponentComponent;
  let fixture: ComponentFixture<ConfirmModalComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmModalComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmModalComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
