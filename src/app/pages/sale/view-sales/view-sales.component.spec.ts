import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSalesComponent } from './view-sales.component';

describe('ViewSalesComponent', () => {
  let component: ViewSalesComponent;
  let fixture: ComponentFixture<ViewSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewSalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
