import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard.component';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';
import { DashboardsRoutingModule } from './dashboard-routing.module';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import {FieldsetModule} from 'primeng/fieldset';
import { StepperModule } from 'primeng/stepper';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessagesModule } from 'primeng/messages';
import { SidebarModule } from 'primeng/sidebar';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { OwnerRegistrationComponent } from '../owner-registration/owner-registration.component';
import { CardsComponent } from "../cards/cards.component";


@NgModule({
    imports: [
    CommonModule,
    TagModule,
    ToolbarModule,
    ConfirmPopupModule,
    SidebarModule,
    MessagesModule,
    FieldsetModule,
    ConfirmDialogModule,
    StepperModule,
    CardModule,
    InputIconModule,
    IconFieldModule,
    InputGroupAddonModule,
    InputGroupModule,
    InputTextModule,
    DropdownModule,
    ToastModule,
    FileUploadModule,
    FormsModule,
    ChartModule,
    MenuModule,
    TabViewModule,
    TableModule,
    StyleClassModule,
    PanelMenuModule,
    ButtonModule,
    DashboardsRoutingModule,
    DialogModule,
    OwnerRegistrationComponent,
    CardsComponent
],
    exports: [StepperModule ],
    declarations: [DashboardComponent]
})
export class DashboardModule { }
