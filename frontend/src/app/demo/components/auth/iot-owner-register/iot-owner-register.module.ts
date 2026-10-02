import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { IoTOwnerRegisterComponent } from './iot-owner-register.component';
import { IoTOwnerRegisterRoutingModule } from './iot-owner-register-routing.module';

@NgModule({
    declarations: [IoTOwnerRegisterComponent],
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        MessageModule,
        PasswordModule,
        IoTOwnerRegisterRoutingModule,
    ],
})
export class IoTOwnerRegisterModule {}
