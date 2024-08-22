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
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InvoiceService } from '../../service/invoice.service';



type Invoice = {

  issueDate: string;
  dueDate: string;
  amounts: number;
  description?: string;
  condominiumId: string;
}

@Component({
  selector: 'app-invice-generater',
  standalone: true,
  imports: [
    HasPermissionsDirective,  
    IconFieldModule,
    InputIconModule,
    DropdownModule,
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
    DialogModule,
    InputTextModule 
  ],
  templateUrl: './invice-generater.component.html',
  styleUrl: './invice-generater.component.scss',
  providers: [
    MessageService,
    ConfirmationService,
    UserService,
    InvoiceService
  ]
})
export class InviceGeneraterComponent {

  public invoice_date_label: Date | undefined;
  
  public display: boolean;
  public invoice: Invoice;
 
  public paymentDescriptionOptions: { label: string, value: string }[];
  public builingInfo:any;
  public descriptionSelected: any;
  public invoiceSetup: boolean;
  public token: string;


  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private _userService: UserService,
    private _invoiceService: InvoiceService
  ) {
    
    this.token = this._userService.getToken();
    this.paymentDescriptionOptions = [
      { label: 'Rent', value: 'Rent' },
      { label: 'Maintenance', value: 'Maintenance' },
      { label: 'Electricity', value: 'Electricity' },
      { label: 'Water', value: 'Water' },
      { label: 'Others', value: 'Others' }
    ];
   
    let mAmount = JSON.parse(localStorage.getItem("property"));
       
    this.invoice = {
      issueDate: "",
      dueDate:"",
      amounts: mAmount.mPayment  || 0,
      description: '',
      condominiumId: mAmount._id
    }
    this.descriptionSelected = "";
    this.invoiceSetup = false;
    console.log('Payments History Component created');

  }

  setDate(){

    let date = new Date(this.invoice.issueDate);
    let currentDate = new Date(date.getTime() + (30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
    
    this.invoice.dueDate = currentDate;
  

  }

  saveInvoice() {

    this.confirmationService.confirm({
      message: 'Are you sure you want to do this action?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
    
        this.invoice.description = this.descriptionSelected[0].value

        
        this._invoiceService.createInvoice(this.token, this.invoice).subscribe({
          next: data => {

            if (data.status === 'success') {
              this.invoiceSetup = true;
              
              this.messageService.add({
                severity: 'success', summary: 'Successfully!', detail: 'Invoice generated successfully!'
              });
              
            }
            console.log(data);
          },
          error: error => {
            console.error('There was an error!', error);
          },
          complete: () => {
            console.log('Completed');
          }
        });
        

      }
    });
    
  
  }

  generateNow() {

    this.confirmationService.confirm({
      message: 'Are you sure you want to do this action?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        this.messageService.add({
          severity: 'success', summary: 'Successfully!', detail: 'Invoice generated successfully!'
        });
       
    
        
        this._invoiceService.generateInvoice(this.token, this.invoice).subscribe({
          next: data => {

            if (data.status === 'success') {
              this.invoiceSetup = true;

              this.messageService.add({
                severity: 'success', summary: 'Successfully!', detail: 'Invoice generated successfully!'
              });
              
            }
            console.log(data);
          },
          error: error => {
            console.error('There was an error!', error);
          },
          complete: () => {
            console.log('Completed');
          }
        });
        

      }
    });
    
  
  }


  onHide() {
    this.display = false;
  }

  open() {
    this.display = true;
  }

}
