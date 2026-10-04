import { TestBed } from '@angular/core/testing';

import { BookingServiceService } from './booking-service.service';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { CookieService } from 'ngx-cookie-service';

describe('BookingServiceService', () => {
  let service: BookingServiceService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: CookieService, useValue: { get: () => 'token' } }
      ]
    });
    service = TestBed.inject(BookingServiceService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('deletes selected reservations with the agreed bulk contract', () => {
    const ids = ['one', 'two'];

    service.deleteReservations('auth-token', ids).subscribe();

    const request = httpTestingController.expectOne(
      `${service.url}deleteReservations`
    );
    expect(request.request.method).toBe('DELETE');
    expect(request.request.body).toEqual({ ids });
    expect(request.request.headers.get('Authorization')).toBe('auth-token');
    request.flush({ success: true, data: { deletedCount: 2 } });
  });
});
