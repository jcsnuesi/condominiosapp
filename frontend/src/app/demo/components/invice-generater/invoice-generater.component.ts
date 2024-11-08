import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
import { CondominioService } from '../../service/condominios.service';



type InvoiceDetails = {

  issueDate: Date | string;
  unit: string;
  amounts: number;
  description?: string;
  condominiumId: string;
  invoiceOwner: Array<{ label: string, value: string }>;
  invoiceOwnerSelected: Array<{ label: string, value: string }>;
  paymentDescription: Array<{ label: string, value: string }>;
  paymentDescriptionSelected: Array<{ label: string, value: string }>;
}

type UpdateInvoiceInfo = {
  
    mPayment: number;
    paymentDate: string;
    id: string;
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
  templateUrl: './invoice-generater.component.html',
  styleUrl: './invoice-generater.component.css',
  providers: [
    MessageService,
    ConfirmationService,
    UserService,
    InvoiceService,
    CondominioService
  ]
})
export class InviceGeneraterComponent {

  public invoice_date_label: Date | undefined;
  public updateInfo: UpdateInvoiceInfo;
  public display: boolean;
  public invoiceInfo: InvoiceDetails;
  public invoiceBelongsTo: { label: string, value: string }[];
  public condoInfo:any;
  public invoiceSetup: boolean;
  public token: string;
  public invoiceBelongsToSelected: any;
  @Output() facturaGenerada = new EventEmitter<any>();

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private _userService: UserService,
    private _invoiceService: InvoiceService,
    private _condoService: CondominioService
  ) {
    
    this.token = this._userService.getToken();
    this.condoInfo = JSON.parse(localStorage.getItem('property'))
    
    this.invoiceInfo = {
      issueDate: '',
      amounts: 0,
      unit: '',
      condominiumId: '',
      invoiceOwner: [],
      invoiceOwnerSelected: [],
      paymentDescription: [{ label: 'Rent', value: 'Rent' },
        { label: 'Plumber', value: 'Plumber' },
        { label: 'Electricity', value: 'Electricity' },
        { label: 'Water', value: 'Water' },
        { label: 'Others', value: 'Others' }],
      paymentDescriptionSelected: []
    }

    this.updateInfo = {
      mPayment: 0,
      paymentDate: '',
      id: ''

    }

    this.invoiceSetup = false;    

  }

  

  setTodayDate() {
  
    const today = new Date(this.condoInfo.paymentDate);
    
    return today.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  }

  dueDateInfo() {

    let dueDate = new Date(this.condoInfo.paymentDate);
    
    dueDate.setDate(dueDate.getDate() + 30);
    
    return dueDate.toISOString().split('T')[0];
  }

  
  updateInvoice(){

 
    this._condoService.updateCondominium(this.token, this.updateInfo).subscribe({
      next: data => {
       
        if(data.status === 'success'){

          // localStorage.setItem('property', JSON.stringify(data.property));
          // Emitimos el evento para que se actualie el toast de factura generada
          this.facturaGenerada.emit({
            severity: 'success', summary: 'Successfully!', detail: 'Invoice updated successfully!'
          })
          // Cerramos el dialogo de invoice
          this.onHide();
          

        } else {


          this.facturaGenerada.emit({
            severity: 'danger', summary: 'Fail', detail: 'Invoice was not updated.'
          })

        }

      },
      error: error => {

        this.facturaGenerada.emit({
          severity: 'danger', summary: 'Fail', detail: 'Invoice was not updated.'
        })
        console.error('There was an error!', error);
      },
      complete: () => {
        console.log('Completed');
      }
    });

  }


  onClickInvoiceOwnerMultiSelect() {

    // let propertyOwner = this.condoInfo; 

    this.invoiceBelongsTo = [];

    for (let i = 0; i < this.condoInfo.units_ownerId.length; i++) {
      let ownerInfo = this.condoInfo.units_ownerId[i].ownerName + " " + this.condoInfo.units_ownerId[i].lastname;
      let propertyInfo = "";
     
      for (let index = 0; index < this.condoInfo.units_ownerId[i].propertyDetails.length; index++) {
        propertyInfo += this.condoInfo.units_ownerId[i].propertyDetails[index].condominium_unit + ' ';
       
      }
      this.invoiceBelongsTo.push({ label: `${ownerInfo.toUpperCase()} - ${propertyInfo.toUpperCase()}`, value: this.condoInfo.units_ownerId[i]._id });
     
    }
    this.invoiceInfo.invoiceOwner = this.invoiceBelongsTo;
  
  }

  

  saveInvoice() {

    this.confirmationService.confirm({
      message: 'Are you sure you want to do this action?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {   
         
       

        
        this._invoiceService.createInvoice(this.token, this.invoiceInfo).subscribe({
          next: data => {

            if (data.status === 'success') {
              this.invoiceSetup = true;

              // Emitimos el evento para que se actualie el toast de factura generada
              this.facturaGenerada.emit({
                severity: 'success', summary: 'Successfully!', detail: 'Invoice generated successfully!'
              })
            // Cerramos el dialogo de invoice
              this.onHide();
              
            }else{


              this.facturaGenerada.emit({
                severity: 'danger', summary: 'Unsuccessful!', detail: 'Invoice was not generated.'
              })

            }
           
          },
          error: error => {

     
            this.facturaGenerada.emit({
              severity: 'danger', summary: 'Unsuccessful!', detail: 'Invoice was not generated.'
            })
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
       
    
        
        this._invoiceService.generateInvoice(this.token, this.invoiceInfo).subscribe({
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

    this.condoInfo = JSON.parse(localStorage.getItem('property'))
  }



  open() {

    this.display = true;

  
    this.updateInfo = {
      mPayment: this.condoInfo.mPayment,
      paymentDate: this.setTodayDate(),
      id: this.condoInfo._id

    }

    this.invoiceInfo = {
      issueDate: '',
      amounts: 0,
      condominiumId: '',
      unit: '',
      invoiceOwner: [],
      invoiceOwnerSelected: [],
      paymentDescription: [{ label: 'Rent', value: 'Rent' },
      { label: 'Plumber', value: 'Plumber' },
      { label: 'Electricity', value: 'Electricity' },
      { label: 'Water', value: 'Water' },
      { label: 'Others', value: 'Others' }],
      paymentDescriptionSelected: []
    }

    

  }

}
