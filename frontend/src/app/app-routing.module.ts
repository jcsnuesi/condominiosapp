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

@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                {
                    path: '',
                    component: AppLayoutComponent,
                    canActivate: [UserGuard],
                    children: [
                        {
                            path: 'home/:homeid',
                            canActivate: [UserGuard],
                            component: HomeComponent,
                        },
                        {
                            path: 'bookings/:dashid',
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
                            path: 'uikit',
                            loadChildren: () =>
                                import(
                                    './demo/components/uikit/uikit.module'
                                ).then((m) => m.UIkitModule),
                        },
                        {
                            path: 'utilities',
                            loadChildren: () =>
                                import(
                                    './demo/components/utilities/utilities.module'
                                ).then((m) => m.UtilitiesModule),
                        },
                        {
                            path: 'documentation',
                            loadChildren: () =>
                                import(
                                    './demo/components/documentation/documentation.module'
                                ).then((m) => m.DocumentationModule),
                        },
                        {
                            path: 'blocks',
                            loadChildren: () =>
                                import(
                                    './demo/components/primeblocks/primeblocks.module'
                                ).then((m) => m.PrimeBlocksModule),
                        },
                        {
                            path: 'pages',
                            loadChildren: () =>
                                import(
                                    './demo/components/pages/pages.module'
                                ).then((m) => m.PagesModule),
                        },
                        {
                            path: 'register',
                            canActivate: [UserGuard],
                            loadChildren: () =>
                                import(
                                    './demo/components/register/register.module'
                                ).then((m) => m.RegisterDemoModule),
                        },
                        {
                            path: 'customers',
                            canActivate: [UserGuard],
                            loadChildren: () =>
                                import(
                                    './demo/components/customers/customers.module'
                                ).then((m) => m.CustomersDemoModule),
                        },
                        {
                            path: 'create-property',
                            canActivate: [UserGuard],
                            component: CreatePropertyComponent,
                        },
                        {
                            path: 'see-property',
                            canActivate: [UserGuard],
                            component: SeePropertyComponent,
                        },
                        {
                            path: 'usermanagement',
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
                            path: 'staff/:homeId',
                            canActivate: [UserGuard],
                            component: StaffComponent,
                        },
                        {
                            path: 'staff-regular/:ownerId',
                            canActivate: [UserGuard],
                            component: StaffComponent,
                        },
                        {
                            path: 'all-partners',
                            canActivate: [UserGuard],
                            component: AllPartnersComponent,
                        },
                        // ,
                        // { path:'booking-area/:admin/:user', canActivate: [UserGuard], component: StaffComponent}
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
                    loadChildren: () =>
                        import('./demo/components/landing/landing.module').then(
                            (m) => m.LandingModule
                        ),
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
