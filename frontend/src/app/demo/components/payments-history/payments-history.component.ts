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
import { FormsModule } from '@angular/forms';
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
import { FormatFunctions } from '../../../pipes/formating_text';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { HttpClient } from '@angular/common/http';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { PipesModuleModule } from 'src/app/pipes/pipes-module.module';
import { Router } from '@angular/router';
import { FamilyMemberDetailsComponent } from '../family-member-details/family-member-details.component';


(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;


type tableData = {
  id: string,
  fullname: string,
  units: string,
  phone: string,
  email: string,
  amounts: number,
  paymentMehtod: string,
  // isRent: boolean,
  invoice_issue_date: string,
  invoice_due_date: string,
  status: string,
  actions: boolean
  

}

type invoiceData = {

  num_invoice: string,
  fullname: string,
  email: string,
  phone: string,
  amount: number,
  invoice_due: string,
  invoice_issue: string,
  status: string,
  unit:string

}

@Component({
  selector: 'app-payments-history',
  standalone: true,
  imports: [
    FamilyMemberDetailsComponent,
    PipesModuleModule,
    PdfViewerModule,
    DialogModule,
    ProgressSpinnerModule,
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
    DialogModule,
  ],
  templateUrl: '../dynamic-table/dynamic-table.component.html',
  styleUrl: './payments-history.component.css',
  providers: [
    MessageService,
    ConfirmationService,
    UserService,
    InvoiceService,
    FormatFunctions]
})
export class PaymentsHistoryComponent implements OnInit {

  @Input() ownerIdInput!: string;
  public bodyTableInfo: any[]; 
  public token: string;
  public tableDataStructure: tableData;
  public headertbl: string = 'Payments History';
  public dynamicHeaders: any;
  public getSeverityColor: any;
  public _upperUfunction: any;
  // public _stringFormating:any;
  public visible_dynamic: boolean;  
  public visible_spinner: boolean; 
  public header_modal_aux = 'Invoice Details';
  public fullItem: any[];
  // public familyMember: any;
  public modalAuxInfo: any;


  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private _userService: UserService,
    private _invoiceService: InvoiceService,
    private _stringFormating: FormatFunctions,
    private _http: HttpClient
    
  ) { 

    this.token = this._userService.getToken();
    this.bodyTableInfo = [];
    // this._stringFormating =  new FormatFunctions();
    
  }

  ngOnInit(): void { 

    this.dynamicHeaders = { id: 'id', fullname: 'Fullname', units: 'Units', phone: 'Phone', amounts: 'Amounts', invoice_issue_date: 'Invoice Issue Date', invoice_due_date: 'Invoice Due Date', status: 'Status', actions: 'Actions' }; 
      
      this.getInvoiceByOwner();
    this.convertImageToBase64();
  }

 
  getInvoiceByOwner() {

    this._invoiceService.getInvoiceByOwner(this.token,this.ownerIdInput).subscribe({
      next: (result) => {


        if (result.status == 'success') {
          
          let invoice = result.invoices

          for (let index = 0; index < result.invoices.length; index++) {

            this.tableDataStructure = {
              id: invoice[index]._id,
              fullname: '',
              units: '',
              phone: '',
              email: '',
              amounts: 0,
              paymentMehtod: '',
              // isRent: false,
              invoice_issue_date: '',
              invoice_due_date: '',
              status: '',
              actions: false
            }
      
            this.tableDataStructure.fullname = this._stringFormating.fullNameFormat(invoice[index].ownerId) 
            this.tableDataStructure.units = this._stringFormating.unitFormat(invoice[index]) 
            this.tableDataStructure.phone = invoice[index].ownerId.phone
            this.tableDataStructure.email = invoice[index].ownerId.email
            this.tableDataStructure.amounts = invoice[index].invoice_amount          
            this.tableDataStructure.paymentMehtod = invoice[index].payment_method
            this.tableDataStructure.status = invoice[index].invoice_status
            this.tableDataStructure.invoice_issue_date = this._stringFormating.dateFormate(invoice[index].invoice_issue) 
            this.tableDataStructure.invoice_due_date = this._stringFormating.dateFormate(invoice[index].invoice_due) 
            this.tableDataStructure.actions = true

            this.bodyTableInfo.push(this.tableDataStructure)          
            
          }       
          console.log(this.bodyTableInfo)

         
   
   
        }              

      },
      error: (error) => {
        console.log('error', error)
      }
    })
    

  }

  
 
  editItem(event: any) {
    
 
    this._invoiceService.getInvoiceById(this.token, event.id).subscribe({
      next:(result) => {

       
  
        if (result.status == 'success') {
       
          this.genPDF(result.invoiceDetails)
          console.log(result)
          
        }else{
          this.visible_spinner = false;
          this.messageService.add({severity:'error', summary:'Error', detail:'Error al obtener la información de la factura'})
        }

      },
      error:(error) => {
        console.log('error', error)
        this.visible_spinner = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener la información de la factura' })
      }
    })

  }




  
genPDF(data) {

  let docDefinition = {

    content: [
      {
        image:this.logoBase64,
        width: 50,
        height: 50,
        alignment: 'left'
      },
     
      { text: 'INVOICE', style: 'header'},
      { text: 'CONDOMINIUM: ' + this._stringFormating.upper(data.condominiumId.alias),    style: 'subheader'},
      { text: `Invoice issue: ${this._stringFormating.dateFormate(data.invoice_issue)}`, style: 'bodyStyle' },
      { text: `Invoice due:${this._stringFormating.dateFormate(data.invoice_due)} `, style: 'bodyStyle' },
     
      {
      table:{
        body: [

         ['Fullname', 'Phone', 'Email', 'Unit', 'Status'],
          [
            this._stringFormating.fullNameFormat(data.ownerId), 
            data.ownerId.phone, data.ownerId.email, 
            this._stringFormating.unitFormat(data),
            data.invoice_status],
        ],
      },
      
    },
    { text: 'Payment Details', style: 'subheader' },
    {
    table:{
      body:[
        ['Description', 'Qty', 'Amount', 'Total'],
        [
          'Condominium Fee', 1, data.invoice_amount, data.invoice_amount
        ]
        
       
      ]
    },
     
  }
    ],
    styles: {
      header: {
        fontSize: 20,
        bold: true,
        alignment: 'center'
      },
      subheader: {
        fontSize: 14,       
        margin: [0, 15, 0, 0]
      },

      bodyStyle:{
        fontSize: 12,
        margin: [0, 15, 0,0]
       
      }
    }
  }

  pdfMake.createPdf(docDefinition).open();

}
  public logoBase64: any;

  
  convertImageToBase64() {
    this._http.get('./assets/noimage2.jpeg', { responseType: 'blob' }).subscribe((blob) => {
      const reader = new FileReader();
      
      reader.onloadend = () => {
        this.logoBase64 = reader.result as string;
    
      };
      reader.readAsDataURL(blob);
    });
  }
 






}
