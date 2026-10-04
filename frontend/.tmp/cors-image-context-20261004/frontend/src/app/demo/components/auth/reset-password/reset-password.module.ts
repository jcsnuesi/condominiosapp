import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ResetPasswordComponent } from './reset-password.component';
import { ResetPasswordRoutingModule } from './reset-password-routing.module';

@NgModule({
    declarations: [ResetPasswordComponent],
    imports: [
        CommonModule,
        FormsModule,
        PasswordModule,
        ButtonModule,
        ToastModule,
        ResetPasswordRoutingModule,
    ],
})
export class ResetPasswordModule {}
