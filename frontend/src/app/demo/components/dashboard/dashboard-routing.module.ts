import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { BookingAreaComponent } from '../booking-area/booking-area.component';
import { StaffComponent } from '../staff/staff.component';
import { FamilyAreaComponent } from '../family-area/family-area.component';
import { UserGuard } from '../../service/routing.guard';
@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: DashboardComponent, canActivate: [UserGuard], data: { permission: 'dashboard.read' } },
            { path: 'start', component: DashboardComponent, canActivate: [UserGuard], data: { permission: 'dashboard.read' } },
            { path: 'start/:id', component: DashboardComponent, canActivate: [UserGuard], data: { permission: 'dashboard.read' } },
            { path: 'booking-area/:id', component: BookingAreaComponent, canActivate: [UserGuard], data: { permission: 'bookings.read' } },
            { path: 'staff-regular/:id', component: StaffComponent, canActivate: [UserGuard], data: { permission: 'staff.read' } },
            {
                path: 'family-area/:id',
                component: FamilyAreaComponent,
            },
        ]),
    ],
    exports: [RouterModule],
})
export class DashboardsRoutingModule {}
