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
import { InvoiceService } from '../../service/invoice.service';


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
    UserService,
  InvoiceService]
})
export class PaymentsHistoryComponent implements OnInit {

  @Input() ownerIdInput!: string;
  public propertyDetailsUser: unitOwerDetails;
  public token: string;


  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private _userService: UserService,
    private _invoiceService: InvoiceService
  ) { 

    this.token = this._userService.getToken()
  }

  ngOnInit(): void {
      console.log('ownerIdInput', this.ownerIdInput);
      this.getInvoiceByOwner();
  }

  getInvoiceByOwner() {

    this._invoiceService.getInvoiceByOwner(this.token,this.ownerIdInput).subscribe({
      next: (result) => {
       
     

        if (result.status == 'success') {
          this.propertyDetailsUser = result.invoices
          // this.propertyDetailsUser.fullname = result.invoices.ownerId.ownerName + ' ' + result.invoices.ownerId.lastname 
          console.log('getInvoiceByOwner result:', result.invoices)
        }
      },
      error: (error) => {
        console.log('error', error)
      }
    })
    

  }

  fullNameFormat(owner): string{
    let fullname = ''

    if (typeof owner.ownerName === 'string' && typeof owner.lastname === 'string') {

      fullname = `${owner.ownerName.toUpperCase()} ${owner.lastname.toUpperCase() }`

    }

    return fullname
  }

  unitFormat(unit): string{
    let unitArray = unit.ownerId.propertyDetails
    let condominioId = unit.condominiumId._id
    let ownerUnit = unit.ownerId.propertyDetails
    let units = ''

    unitArray.forEach(property => {
     
      if (property.addressId == condominioId) {
       
        units += property.condominium_unit
      
        
      }

      

    });

    // console.log('condominioId', condominioId)
   
    // console.log('unitFormat', units)
    return units
  }

  dateFormate(date: string): string {
    let dateFormated = new Date(date)
    return dateFormated.toDateString() 
  }


  loadPaymentsHistory() {

    // this.propertyDetailsUser = events
    // this.propertyDetailsUser.units = events.propertyDetails.condominium_unit
    // this.propertyDetailsUser.fullname = events.ownerName + ' ' + events.lastname
    // this.propertyDetailsUser.isRent = events.isRenting
    // this.propertyDetailsUser.emergecyPhoneNumber = '809-555-5555'
    // this.propertyDetailsUser.paymentMehtod = 'Deposit: Bank of America'

  }


  getSeverity(invoice_status: string) {
    if (invoice_status == 'new') {
      return 'success'
    } else if (invoice_status == 'pending') {
      return 'warning'
    } else if (invoice_status == 'overdue') {
      return 'danger'
    }else{
      return 'info'
    }
  }






}
