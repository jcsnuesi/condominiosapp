import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { BookingAreaComponent } from '../booking-area/booking-area.component';
import { StaffComponent } from '../staff/staff.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DashboardComponent},
        { path: 'start', component: DashboardComponent },
        { path: 'start/:id', component: DashboardComponent },
        { path: 'booking-area/:ownerId', component: BookingAreaComponent},
        { path: 'staff-regular/:ownerId', component: StaffComponent }
    ])],
    exports: [RouterModule]
})
export class DashboardsRoutingModule { }
