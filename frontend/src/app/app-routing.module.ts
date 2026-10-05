import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from './layout/app.layout.component';
import { UserGuard } from './demo/service/routing.guard';
import { CreatePropertyComponent } from './demo/components/create-property/create-property.component';
import { SeePropertyComponent } from './demo/components/see-property/see-property.component';
import { CreateUserComponent } from './demo/components/create-user/create-user.component';
import { HomeComponent } from './demo/components/home/home.component';
import { FamilyAreaComponent } from './demo/components/family-area/family-area.component';
import { InvoiceHistoryComponent } from './demo/components/invoice-history/invoice-history.component';
import { StaffComponent } from './demo/components/staff/staff.component';
import { DashboardComponent } from './demo/components/dashboard/dashboard.component';
import { BookingAreaComponent } from './demo/components/booking-area/booking-area.component';
import { OwnerProfileComponent } from './demo/components/owner-profile/owner-profile.component';
import { AllPartnersComponent } from './demo/components/all-partners/all-partners.component';
import { DocsComponent } from './demo/components/docs/docs.component';
import { StrIntegrationComponent } from './demo/components/str-integration/str-integration.component';
import { PaymentMonitorComponent } from './demo/components/payment-monitor/payment-monitor.component';
import { CommunicationLogComponent } from './demo/components/communication-log/communication-log.component';

@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                {
                    path: '',
                    pathMatch: 'full',
                    loadComponent: () =>
                        import(
                            './demo/components/saas-landing/saas-landing.component'
                        ).then((m) => m.SaasLandingComponent),
                },
                {
                    path: '',
                    component: AppLayoutComponent,
                    canActivate: [UserGuard],
                    children: [
                        {
                            path: 'schedule',
                            data: { permission: 'schedules.read' },
                            canActivate: [UserGuard],
                            loadComponent: () =>
                                import(
                                    './demo/components/schedule/schedule.component'
                                ).then((m) => m.ScheduleComponent),
                        },
                        {
                            path: 'finance',
                            data: {
                                permission: 'finance.read',
                                roles: ['ADMIN', 'STAFF_ADMIN', 'OWNER'],
                            },
                            canActivate: [UserGuard],
                            loadComponent: () =>
                                import(
                                    './demo/components/finance/finance.component'
                                ).then((m) => m.FinanceComponent),
                        },
                        {
                            path: 'onboarding',
                            data: { roles: ['ADMIN'] },
                            canActivate: [UserGuard],
                            loadComponent: () =>
                                import(
                                    './demo/components/organization-onboarding/organization-onboarding.component'
                                ).then(
                                    (m) => m.OrganizationOnboardingComponent
                                ),
                        },
                        {
                            path: 'home/:homeid',
                            canActivate: [UserGuard],
                            component: HomeComponent,
                        },
                        {
                            path: 'bookings/:id',
                            data: { permission: 'bookings.read' },
                            canActivate: [UserGuard],
                            component: BookingAreaComponent,
                        },
                        {
                            path: '',
                            canActivate: [UserGuard],
                            loadChildren: () =>
                                import(
                                    './demo/components/dashboard/dashboard.module'
                                ).then((m) => m.DashboardModule),
                        },

                        {
                            path: 'create-property',
                            data: { permission: 'condominiums.create' },
                            canActivate: [UserGuard],
                            component: CreatePropertyComponent,
                        },
                        {
                            path: 'see-property',
                            data: { permission: 'condominiums.read' },
                            canActivate: [UserGuard],
                            component: SeePropertyComponent,
                        },
                        {
                            path: 'usermanagement',
                            data: { permission: 'users.read' },
                            canActivate: [UserGuard],
                            component: CreateUserComponent,
                        },
                        {
                            path: 'family-area/:id',
                            canActivate: [UserGuard],
                            component: FamilyAreaComponent,
                        },
                        {
                            path: 'invoice-history/:condoId',
                            canActivate: [UserGuard],
                            component: InvoiceHistoryComponent,
                        },
                        {
                            path: 'staff/:id',
                            data: { permission: 'staff.read' },
                            canActivate: [UserGuard],
                            component: StaffComponent,
                        },
                        {
                            path: 'all-partners',
                            data: { permission: 'owners.read' },
                            canActivate: [UserGuard],
                            component: AllPartnersComponent,
                        },
                        {
                            path: 'partners/:id',
                            data: { permission: 'owners.read' },
                            canActivate: [UserGuard],
                            component: OwnerProfileComponent,
                        },
                        {
                            path: 'docs/:id',
                            data: { permission: 'documents.read' },
                            canActivate: [UserGuard],
                            component: DocsComponent,
                        },
                        {
                            path: 'str-integration',
                            data: { permission: 'str.read' },
                            canActivate: [UserGuard],
                            component: StrIntegrationComponent,
                        },
                        {
                            path: 'payment-monitor',
                            data: { permission: 'finance.read' },
                            canActivate: [UserGuard],
                            component: PaymentMonitorComponent,
                        },
                        {
                            path: 'smart-home',
                            data: { permission: 'iot.read' },
                            canActivate: [UserGuard],
                            loadChildren: () =>
                                import(
                                    './demo/components/iot-dashboard/iot-dashboard.module'
                                ).then((m) => m.IoTDashboardModule),
                        },
                        {
                            path: 'communication-log',
                            data: { permission: 'communications.read' },
                            canActivate: [UserGuard],
                            component: CommunicationLogComponent,
                        },
                    ],
                },
                {
                    path: 'auth',
                    loadChildren: () =>
                        import('./demo/components/auth/auth.module').then(
                            (m) => m.AuthModule
                        ),
                },
                {
                    path: 'landing',
                    pathMatch: 'full',
                    redirectTo: '',
                },
                { path: 'notfound', component: NotfoundComponent },
                { path: '**', redirectTo: '/notfound' },
            ],
            {
                scrollPositionRestoration: 'enabled',
                anchorScrolling: 'enabled',
                onSameUrlNavigation: 'reload',
            }
        ),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
