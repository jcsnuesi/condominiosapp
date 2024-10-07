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
import { FormatFunctions } from '../../service/formating_text';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
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
    InvoiceService]
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
  public _stringFormating:any;
  public visible_dynamic: boolean;  
  public visible_spinner: boolean; 
  public header_modal_aux = 'Invoice Details';
  public fullItem: any[];
  public pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";


  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private _userService: UserService,
    private _invoiceService: InvoiceService
    
  ) { 

    this.token = this._userService.getToken();
    this.bodyTableInfo = [];
    this._stringFormating =  new FormatFunctions();
    
  }

  ngOnInit(): void {
  
  
      this.getInvoiceByOwner();
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

          // Excluir paymentMehtod, email
          this.dynamicHeaders = Object.keys(this.tableDataStructure).filter((key) => key !== 'paymentMehtod' && key !== 'email');      
   
        }              

      },
      error: (error) => {
        console.log('error', error)
      }
    })
    

  }

  
 
  editItem(event: any) {
    
    // this.visible_spinner = true;
    // this.visible_dynamic = true;
    this._invoiceService.getInvoiceById(this.token, event.id).subscribe({
      next:(result) => {

        console.log("*************INVOICE***************")
  
        if (result.status == 'success') {
          
          // this.visible_spinner = false;
          
          
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
      { text: 'Factura', style: 'header' },
      { text: 'Número de Factura: ' + data.condominiumId.alias, style: 'subheader' }
      //  ,
      // { text: 'Nombre: ' + this.fullItem[0].fullname, style: 'subheader' },
      // { text: 'Email: ' + this.fullItem[0].email, style: 'subheader' },
      // { text: 'Teléfono: ' + this.fullItem[0].phone, style: 'subheader' },
      // { text: 'Monto: ' + this.fullItem[0].amount, style: 'subheader' },
      // { text: 'Fecha de Emisión: ' + this.fullItem[0].invoice_issue, style: 'subheader' },
      // { text: 'Fecha de Vencimiento: ' + this.fullItem[0].invoice_due, style: 'subheader' },
      // { text: 'Estado: ' + this.fullItem[0].status, style: 'subheader' },
      // { text: 'Unidad: ' + this.fullItem[0].unit, style: 'subheader' },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true
      },
      subheader: {
        fontSize: 14,
        bold: true
      }
    }
  }

  pdfMake.createPdf(docDefinition).open();

}





}
