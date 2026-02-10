import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosVersionComponent } from './pos-version.component';

describe('PosVersionComponent', () => {
  let component: PosVersionComponent;
  let fixture: ComponentFixture<PosVersionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosVersionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
