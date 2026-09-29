import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertiesByOwnerComponent } from './properties-by-owner.component';

describe('PropertiesByOwnerComponent', () => {
  let component: PropertiesByOwnerComponent;
  let fixture: ComponentFixture<PropertiesByOwnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertiesByOwnerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertiesByOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
