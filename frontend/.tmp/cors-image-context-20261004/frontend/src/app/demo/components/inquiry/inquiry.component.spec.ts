import {
    ComponentFixture,
    TestBed,
    fakeAsync,
    tick,
} from '@angular/core/testing';
import { SimpleChange } from '@angular/core';
import { of, throwError } from 'rxjs';

import { InquiryComponent } from './inquiry.component';
import { InquiryService } from '../../service/inquiry.service';

describe('InquiryComponent', () => {
    let component: InquiryComponent;
    let fixture: ComponentFixture<InquiryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [InquiryComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(InquiryComponent);
        component = fixture.componentInstance;
        component.identity = { _id: 'user-1', role: 'ADMIN' };
        component.token = 'token-123';
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should derive inquiry stats from current data without stale mutable state', () => {
        component.inquiries = [
            {
                title: 'A',
                content: 'X',
                category: 'payment',
                priority: 'high',
                status: 'sent',
                createdBy: '1',
                condominiumId: 'c1',
            },
            {
                title: 'B',
                content: 'Y',
                category: 'noise',
                priority: 'medium',
                status: 'responded',
                createdBy: '1',
                condominiumId: 'c1',
            },
            {
                title: 'C',
                content: 'Z',
                category: 'security',
                priority: 'low',
                status: 'closed',
                createdBy: '1',
                condominiumId: 'c1',
            },
        ];

        expect(component.inquiryStats.total).toBe(3);
        expect(component.inquiryStats.open).toBe(1);
        expect(component.inquiryStats.inProgress).toBe(1);
        expect(component.inquiryStats.closed).toBe(1);
    });

    it('should derive unread notice count from current notices', () => {
        component.notices = [
            {
                _id: 'n1',
                title: 'A',
                content: 'X',
                type: 'general',
                priority: 'medium',
                condominiumId: 'c1',
                isRead: false,
            },
            {
                _id: 'n2',
                title: 'B',
                content: 'Y',
                type: 'general',
                priority: 'medium',
                condominiumId: 'c1',
                isRead: true,
            },
        ];

        expect(component.unreadNoticesCount).toBe(1);

        component.notices[0].isRead = true;
        expect(component.unreadNoticesCount).toBe(0);
    });

    it('should open the inquiry supplied by the dashboard when it is already loaded', fakeAsync(() => {
        const inquiry = {
            _id: 'inquiry-1',
            title: 'Water leak',
            content: 'Leak in unit A-2',
            category: 'maintenance',
            priority: 'high' as const,
            status: 'sent' as const,
            createdBy: 'owner-1',
            condominiumId: 'condo-1',
        };
        const dataDialog = {
            _id: inquiry._id,
            visible: true,
            identity: { _id: 'user-1', role: 'ADMIN' },
        };
        component.inquiries = [inquiry];
        component.dataDialog = dataDialog;

        component.ngOnChanges({
            dataDialog: new SimpleChange(null, dataDialog, false),
        });
        tick();

        expect(component.selectedInquiry).toBe(inquiry);
        expect(component.displayInquiryDetailDialog).toBeTrue();
    }));

    it('should wait for the API response before opening the requested inquiry', fakeAsync(() => {
        const inquiry = {
            _id: 'inquiry-2',
            title: 'Access request',
            content: 'Access is required for a contractor',
            category: 'security',
            priority: 'medium' as const,
            status: 'responded' as const,
            createdBy: 'owner-2',
            condominiumId: 'condo-1',
        };
        const dataDialog = {
            _id: inquiry._id,
            visible: true,
            identity: { _id: 'user-1', role: 'ADMIN' },
        };
        const inquiryService = fixture.debugElement.injector.get(InquiryService);
        spyOn(inquiryService, 'getOwnerInquiries').and.returnValue(
            of({
                success: true,
                status: 'success',
                message: '',
                data: { docs: [inquiry] },
            })
        );
        component.dataDialog = dataDialog;

        component.ngOnChanges({
            dataDialog: new SimpleChange(null, dataDialog, false),
        });
        expect(component.displayInquiryDetailDialog).toBeFalse();

        component.loadInquiries();
        tick();

        expect(component.selectedInquiry).toEqual(inquiry);
        expect(component.displayInquiryDetailDialog).toBeTrue();
    }));

    it('should send the authenticated user as inquiry author', () => {
        const inquiryService = fixture.debugElement.injector.get(InquiryService);
        const createSpy = spyOn(
            inquiryService,
            'createInquiryWithFiles'
        ).and.returnValue(
            of({ success: false, status: 'error', message: 'Expected test response' })
        );
        component.condoId = 'condo-1';
        component.newInquiry = {
            title: 'Water leak',
            content: 'There is a leak',
            category: 'maintenance',
            priority: 'high',
            status: 'sent',
            createdBy: '',
            condominiumId: 'condo-1',
        };

        component.submitInquiry();

        const formData = createSpy.calls.mostRecent().args[0] as FormData;
        expect(formData.get('createdBy')).toBe('user-1');
        expect(formData.get('condominiumId')).toBe('condo-1');
        expect(component.isSubmittingInquiry).toBeFalse();
    });

    it('should create an all-audience notice without specific recipients', () => {
        const inquiryService = fixture.debugElement.injector.get(InquiryService);
        const createSpy = spyOn(inquiryService, 'createNotice').and.returnValue(
            of({ success: true, status: 'success', message: 'Created' })
        );
        component.condoId = 'condo-1';
        component.newNotice = {
            title: 'Maintenance',
            content: 'Water service maintenance',
            type: 'maintenance',
            priority: 'medium',
            condominiumId: 'condo-1',
            targetAudience: 'all',
            publishImmediately: true,
        };

        component.submitNotice();

        const formData = createSpy.calls.mostRecent().args[0] as FormData;
        expect(formData.getAll('specificRecipients[]')).toEqual([]);
        expect(formData.get('publishImmediately')).toBe('true');
        expect(formData.get('publishedAt')).toBeTruthy();
        expect(component.isCreatingNotice).toBeFalse();
    });

    it('should replace the inquiry row with the nested inquiry returned after a response', () => {
        const inquiryService = fixture.debugElement.injector.get(InquiryService);
        const originalInquiry = {
            _id: 'inquiry-1',
            title: 'Access',
            content: 'Gate access',
            category: 'security',
            priority: 'medium' as const,
            status: 'sent' as const,
            createdBy: 'user-1',
            condominiumId: 'condo-1',
        };
        const updatedInquiry = {
            ...originalInquiry,
            status: 'responded' as const,
        };
        spyOn(inquiryService, 'addInquiryResponse').and.returnValue(
            of({
                success: true,
                status: 'success',
                message: 'Response added successfully',
                data: {
                    message: 'Response added successfully',
                    inquiry: updatedInquiry,
                },
            })
        );
        component.inquiries = [originalInquiry];
        component.selectedInquiry = originalInquiry;
        component.newResponse = 'Please review';

        component.addResponseToInquiry();

        expect(component.inquiries).toEqual([updatedInquiry]);
        expect(component.selectedInquiry).toEqual(updatedInquiry);
        expect(component.newResponse).toBe('');
    });

    it('should release the response loading state after an API error', () => {
        const inquiryService = fixture.debugElement.injector.get(InquiryService);
        spyOn(inquiryService, 'addInquiryResponse').and.returnValue(
            throwError(() => new Error('network error'))
        );
        component.selectedInquiry = {
            _id: 'inquiry-1',
            title: 'Access',
            content: 'Gate access',
            category: 'security',
            priority: 'medium',
            status: 'sent',
            createdBy: 'user-1',
            condominiumId: 'condo-1',
        };
        component.newResponse = 'Please review';

        component.addResponseToInquiry();

        expect(component.isSendingResponse).toBeFalse();
    });

    it('should keep ADMIN and STAFF_ADMIN responses on the left', () => {
        const administrativeResponses = ['ADMIN', 'STAFF_ADMIN'].map(
            (role, index) => ({
                _id: `admin-response-${index}`,
                message: `Administrative response ${index}`,
                respondedBy: {
                    _id: `admin-${index}`,
                    name: 'Administrative User',
                    role,
                },
                respondedByModel: role === 'ADMIN' ? 'Admin' : 'Staff_Admin',
                respondedByRole: role,
                isAdminResponse: true,
                createdAt: new Date('2026-08-23T14:00:00.000Z'),
            })
        );

        administrativeResponses.forEach((response) => {
            expect(component.isAdministrativeResponse(response)).toBeTrue();
            expect(component.getResponseSide(response)).toBe('left');
        });
    });

    it('should keep OWNER and FAMILY responses on the right', () => {
        const residentResponses = ['OWNER', 'FAMILY'].map((role, index) => ({
            _id: `resident-response-${index}`,
            message: `Resident response ${index}`,
            respondedBy: {
                _id: `resident-${index}`,
                name: 'Resident User',
                role,
            },
            respondedByModel: role === 'OWNER' ? 'Owner' : 'Family',
            respondedByRole: role,
            isAdminResponse: false,
            createdAt: new Date('2026-08-23T14:05:00.000Z'),
        }));

        residentResponses.forEach((response) => {
            expect(component.isAdministrativeResponse(response)).toBeFalse();
            expect(component.getResponseSide(response)).toBe('right');
        });
    });

    it('should use the nested author role when the response role is missing', () => {
        const response = {
            _id: 'staff-response',
            message: 'Handled by staff',
            respondedBy: {
                _id: 'staff-1',
                name: 'Staff User',
                role: 'STAFF_ADMIN',
            },
            respondedByModel: 'Staff_Admin',
            respondedByRole: '',
            isAdminResponse: false,
            createdAt: new Date('2026-08-23T14:10:00.000Z'),
        };

        expect(component.isAdministrativeResponse(response)).toBeTrue();
        expect(component.getResponseSide(response)).toBe('left');
    });

    it('should paginate filtered notices', () => {
        component.noticeRows = 2;
        component.noticeFirst = 2;
        component.notices = [0, 1, 2, 3, 4].map((index) => ({
            _id: `notice-${index}`,
            title: `Notice ${index}`,
            content: 'Content',
            type: 'general' as const,
            priority: 'medium' as const,
            condominiumId: 'condo-1',
        }));

        expect(component.getPaginatedNotices().map(({ _id }) => _id)).toEqual([
            'notice-2',
            'notice-3',
        ]);

        component.onNoticeFilterChange();
        expect(component.noticeFirst).toBe(0);
    });

    it('should finish mark-all and preserve failed notices as unread', () => {
        const inquiryService = fixture.debugElement.injector.get(InquiryService);
        component.notices = [
            {
                _id: 'notice-1', title: 'One', content: 'A', type: 'general',
                priority: 'medium', condominiumId: 'condo-1', isRead: false,
            },
            {
                _id: 'notice-2', title: 'Two', content: 'B', type: 'general',
                priority: 'medium', condominiumId: 'condo-1', isRead: false,
            },
        ];
        spyOn(inquiryService, 'markNoticeAsRead').and.callFake(
            (_token, noticeId) =>
                noticeId === 'notice-1'
                    ? of({ success: true, status: 'success', message: '' })
                    : throwError(() => new Error('failed'))
        );

        component.markAllNoticesAsRead();

        expect(component.isMarkingAllRead).toBeFalse();
        expect(component.notices[0].isRead).toBeTrue();
        expect(component.notices[1].isRead).toBeFalse();
    });
});
