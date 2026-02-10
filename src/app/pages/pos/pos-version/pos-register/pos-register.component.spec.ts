import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosRegisterComponent } from './pos-register.component';

describe('PosRegisterComponent', () => {
  let component: PosRegisterComponent;
  let fixture: ComponentFixture<PosRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
