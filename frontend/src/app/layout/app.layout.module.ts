import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { DrawerModule } from 'primeng/drawer';
import { BadgeModule } from 'primeng/badge';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { RippleModule } from 'primeng/ripple';
import { AppMenuComponent } from './app.menu.component';
import { AppMenuitemComponent } from './app.menuitem.component';
import { RouterModule } from '@angular/router';
import { AppTopBarComponent } from './app.topbar.component';
import { AppFooterComponent } from './app.footer.component';
import { AppConfigModule } from './config/config.module';
import { AppSidebarComponent } from './app.sidebar.component';
import { AppLayoutComponent } from './app.layout.component';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { MenuModule } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';
import { CondominioService } from '../demo/service/condominios.service';
import { DialogModule } from 'primeng/dialog';
import { TabsModule } from 'primeng/tabs';
import { StepperModule } from 'primeng/stepper';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { HasPermissionsDirective } from '../has-permissions.directive';
import { MultiSelectModule } from 'primeng/multiselect';
import { DatePickerModule } from 'primeng/datepicker';
import { ChangePasswordComponent } from '../demo/components/change-password/change-password.component';
import { AuthenticatedUserProfileComponent } from './authenticated-user-profile/authenticated-user-profile.component';
import { SupportCallComponent } from './support-call/support-call.component';
import { PlatformAnnouncementsComponent } from './platform-announcements.component';

@NgModule({
    declarations: [
        AppMenuitemComponent,
        AppTopBarComponent,
        AppFooterComponent,
        AppMenuComponent,
        AppSidebarComponent,
        AppLayoutComponent,
    ],
    imports: [
        SupportCallComponent,
        PlatformAnnouncementsComponent,
        AuthenticatedUserProfileComponent,
        ChangePasswordComponent,
        MultiSelectModule,
        DatePickerModule,
        HasPermissionsDirective,
        TabsModule,
        InputNumberModule,
        SelectModule,
        FileUploadModule,
        StepperModule,
        TabsModule,
        DialogModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        InputTextModule,
        DrawerModule,
        BadgeModule,
        RadioButtonModule,
        ToggleSwitchModule,
        RippleModule,
        RouterModule,
        AppConfigModule,
        AvatarModule,
        AvatarGroupModule,
        MenuModule,
        ToastModule,
    ],
    exports: [AppLayoutComponent],
})
export class AppLayoutModule {}
