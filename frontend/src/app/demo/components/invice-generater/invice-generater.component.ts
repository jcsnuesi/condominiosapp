import { Component, Input, OnInit } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, NgForm } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { DropdownModule } from 'primeng/dropdown';
import { HasPermissionsDirective } from 'src/app/has-permissions.directive';
import { TableModule } from 'primeng/table';
import { UserService } from '../../service/user.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { unitOwerDetails } from '../../models/property_details_type';
import { CalendarModule } from 'primeng/calendar';


@Component({
  selector: 'app-invice-generater',
  standalone: true,
  imports: [
    HasPermissionsDirective,  
    CalendarModule,
    ConfirmPopupModule,
    ButtonModule,
    TagModule,
    CardModule,
    MultiSelectModule,
    ConfirmDialogModule,
    TableModule,
    DropdownModule,
    FormsModule,
    CommonModule,
    FileUploadModule,
    InputGroupModule,
    InputGroupAddonModule,
    ToastModule,
    InputTextModule,
    AvatarModule,
    AvatarGroupModule,
    ToolbarModule,
    DialogModule
  ],
  templateUrl: './invice-generater.component.html',
  styleUrl: './invice-generater.component.scss',
  providers: [
    MessageService,
    ConfirmationService,
    UserService
  ]
})
export class InviceGeneraterComponent {

  public invoice_date_label: Date | undefined;
  
  display: boolean;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private _userService: UserService
  ) {
   
    console.log('Payments History Component created');

  }


  onHide() {
    this.display = false;
  }

  open() {
    this.display = true;
  }

}
