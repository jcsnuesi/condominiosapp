import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { BookingAreaComponent } from '../booking-area/booking-area.component';
import { StaffComponent } from '../staff/staff.component';
import { FamilyAreaComponent } from '../family-area/family-area.component';
@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: DashboardComponent },
            { path: 'start', component: DashboardComponent },
            { path: 'start/:id', component: DashboardComponent },
            { path: 'booking-area/:id', component: BookingAreaComponent },
            { path: 'staff-regular/:id', component: StaffComponent },
            {
                path: 'family-area/:id',
                component: FamilyAreaComponent,
            },
        ]),
    ],
    exports: [RouterModule],
})
export class DashboardsRoutingModule {}
