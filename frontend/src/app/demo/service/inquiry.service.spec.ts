import { TestBed } from '@angular/core/testing';
import {
    HttpTestingController,
    provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { InquiryService } from './inquiry.service';

describe('InquiryService', () => {
    let service: InquiryService;
    let httpController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                InquiryService,
                provideHttpClient(),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(InquiryService);
        httpController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => httpController.verify());

    it('should authenticate notice detail requests', () => {
        service.getNoticeDetails('notice-1', 'token-123').subscribe();

        const request = httpController.expectOne((req) =>
            req.url.endsWith('notices/notice-1')
        );
        expect(request.request.headers.get('Authorization')).toBe('token-123');
        request.flush({ success: true, data: {} });
    });

    it('should authenticate mark-all requests', () => {
        service.markAllNoticesAsRead('token-123').subscribe();

        const request = httpController.expectOne((req) =>
            req.url.endsWith('notices/mark-all-read')
        );
        expect(request.request.headers.get('Authorization')).toBe('token-123');
        request.flush({ success: true, data: {} });
    });

    it('should download an encoded attachment as an authenticated blob', () => {
        service
            .downloadNoticeAttachment('token-123', 'maintenance report.pdf')
            .subscribe((blob) => expect(blob.type).toBe('application/pdf'));

        const request = httpController.expectOne((req) =>
            req.url.endsWith(
                'notifications/file/maintenance%20report.pdf'
            )
        );
        expect(request.request.responseType).toBe('blob');
        expect(request.request.headers.get('Authorization')).toBe('token-123');
        request.flush(new Blob(['report'], { type: 'application/pdf' }));
    });
});
