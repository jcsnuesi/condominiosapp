import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPartnersComponent } from './all-partners.component';

describe('AllPartnersComponent', () => {
  let component: AllPartnersComponent;
  let fixture: ComponentFixture<AllPartnersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllPartnersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllPartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
