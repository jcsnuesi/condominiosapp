import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingAreaComponent } from './booking-area.component';
import { of } from 'rxjs';

describe('BookingAreaComponent', () => {
  let component: BookingAreaComponent;
  let fixture: ComponentFixture<BookingAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingAreaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('BookingAreaComponent deletion rules', () => {
  let component: BookingAreaComponent;

  beforeEach(() => {
    component = Object.create(BookingAreaComponent.prototype);
    component.selectedRow = [];
    component.isDeletingBookings = false;
  });

  it('only allows Reserved bookings whose raw checkout has passed', () => {
    const now = new Date('2026-08-28T12:00:00.000Z');
    const eligible = {
      status: 'Reserved',
      checkOutAt: '2026-08-28T11:59:59.000Z'
    } as any;

    expect(component.isDeletionEligible(eligible, now)).toBeTrue();
    expect(component.isDeletionEligible({ ...eligible, status: 'Guest' }, now)).toBeFalse();
    expect(
      component.isDeletionEligible(
        { ...eligible, checkOutAt: '2026-08-28T13:00:00.000Z' },
        now
      )
    ).toBeFalse();
    expect(
      component.isDeletionEligible(
        { ...eligible, checkOutAt: now.toISOString() },
        now
      )
    ).toBeFalse();
  });

  it('reports partial deletion counts and refreshes the history', () => {
    const bookingService = {
      deleteReservations: jasmine.createSpy().and.returnValue(
        of({
          success: true,
          data: { deletedCount: 1, skippedCount: 1 }
        })
      )
    };
    const messageService = { add: jasmine.createSpy() };
    (component as any)._bookingService = bookingService;
    (component as any)._messageService = messageService;
    component.token = 'token';
    component.condoId = 'condo-id';
    spyOn(component, 'getAllBookings');

    (component as any).deleteSelectedBookings([
      { id: 'one' },
      { id: 'two' }
    ]);

    expect(messageService.add).toHaveBeenCalledWith(
      jasmine.objectContaining({ severity: 'success', detail: '1 booking deleted permanently.' })
    );
    expect(messageService.add).toHaveBeenCalledWith(
      jasmine.objectContaining({ severity: 'warn' })
    );
    expect(component.getAllBookings).toHaveBeenCalledWith('condo-id');
  });
});
