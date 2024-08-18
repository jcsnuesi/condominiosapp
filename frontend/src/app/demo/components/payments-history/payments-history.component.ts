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


@Component({
  selector: 'app-payments-history',
  standalone: true,
  imports: [
    HasPermissionsDirective,
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
    DialogModule],
  templateUrl: './payments-history.component.html',
  styleUrl: './payments-history.component.scss',
  providers: [
    MessageService,
    ConfirmationService,
    UserService]
})
export class PaymentsHistoryComponent {

  @Input() ownerIdInput!: string;
  public propertyDetailsUser: unitOwerDetails;



  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private _userService: UserService
  ) { 


  }

  loadPaymentsHistory() {

    // this.propertyDetailsUser = events
    // this.propertyDetailsUser.units = events.propertyDetails.condominium_unit
    // this.propertyDetailsUser.fullname = events.ownerName + ' ' + events.lastname
    // this.propertyDetailsUser.isRent = events.isRenting
    // this.propertyDetailsUser.emergecyPhoneNumber = '809-555-5555'
    // this.propertyDetailsUser.paymentMehtod = 'Deposit: Bank of America'

  }






}
