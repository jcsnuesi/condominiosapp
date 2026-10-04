import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IoTOwnerRegisterComponent } from './iot-owner-register.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: IoTOwnerRegisterComponent },
        ]),
    ],
    exports: [RouterModule],
})
export class IoTOwnerRegisterRoutingModule {}
