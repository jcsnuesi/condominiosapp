import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyAreaComponent } from './family-area.component';

describe('FamilyAreaComponent', () => {
  let component: FamilyAreaComponent;
  let fixture: ComponentFixture<FamilyAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FamilyAreaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FamilyAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
