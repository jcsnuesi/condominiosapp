import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerProfileSettingsComponent } from './owner-profile-settings.component';

describe('OwnerProfileSettingsComponent', () => {
  let component: OwnerProfileSettingsComponent;
  let fixture: ComponentFixture<OwnerProfileSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerProfileSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerProfileSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
