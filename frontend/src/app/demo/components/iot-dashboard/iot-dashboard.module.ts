import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputNumberModule } from 'primeng/inputnumber';
import { IoTDashboardRoutingModule } from './iot-dashboard-routing.module';
import { IoTDashboardComponent } from './iot-dashboard.component';

@NgModule({
    declarations: [IoTDashboardComponent],
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        ConfirmDialogModule,
        DialogModule,
        InputTextModule,
        InputNumberModule,
        MessageModule,
        SelectModule,
        TagModule,
        ToastModule,
        ProgressSpinnerModule,
        IoTDashboardRoutingModule,
    ],
    providers: [],
})
export class IoTDashboardModule {}
