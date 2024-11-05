import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviceGeneraterComponent } from './invoice-generater.component';

describe('InviceGeneraterComponent', () => {
  let component: InviceGeneraterComponent;
  let fixture: ComponentFixture<InviceGeneraterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InviceGeneraterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InviceGeneraterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
