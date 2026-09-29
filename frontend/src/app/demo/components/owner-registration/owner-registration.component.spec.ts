import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerRegistrationComponent } from './owner-registration.component';

describe('OwnerRegistrationComponent', () => {
  let component: OwnerRegistrationComponent;
  let fixture: ComponentFixture<OwnerRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerRegistrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the first step when initialized', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(component.indexStepper).toBe(1);
    expect(element.textContent).toContain('Basic Info');
    expect(element.querySelector('input[name="ownerName"]')).not.toBeNull();
  });

  it('should initialize safely when identity is unavailable', () => {
    expect(component.getId()).toBeNull();
    expect(fixture.nativeElement.querySelector('p-stepper')).not.toBeNull();
  });

  it('should expose the same clickable photo loader pattern', () => {
    const trigger = spyOn(component, 'triggerFileUpload');
    const photoControl = fixture.nativeElement.querySelector(
      '.cp-avatar-wrap'
    ) as HTMLElement;

    photoControl.click();

    expect(trigger).toHaveBeenCalled();
    expect(photoControl.getAttribute('role')).toBe('button');
    expect(fixture.nativeElement.querySelector('.cp-avatar-overlay')).not.toBeNull();
  });
});
