import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IoTDashboardComponent } from './iot-dashboard.component';

@NgModule({
    imports: [
        RouterModule.forChild([{ path: '', component: IoTDashboardComponent }]),
    ],
    exports: [RouterModule],
})
export class IoTDashboardRoutingModule {}
