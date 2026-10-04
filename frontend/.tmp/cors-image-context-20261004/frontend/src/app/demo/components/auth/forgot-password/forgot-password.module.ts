import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ForgotPasswordRoutingModule } from './forgot-password-routing.module';
import { ForgotPasswordComponent } from './forgot-password.component';

@NgModule({
    declarations: [ForgotPasswordComponent],
    imports: [
        CommonModule,
        FormsModule,
        InputTextModule,
        ButtonModule,
        ToastModule,
        ForgotPasswordRoutingModule,
    ],
})
export class ForgotPasswordModule {}
