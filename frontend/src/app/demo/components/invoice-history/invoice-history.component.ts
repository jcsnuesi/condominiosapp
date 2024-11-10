import { Component, OnInit } from '@angular/core';
import { TitleCasePipe, DatePipe, CurrencyPipe, UpperCasePipe } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { UserService } from '../../service/user.service';
import { ActivatedRoute,Router } from '@angular/router';
import { InvoiceService } from '../../service/invoice.service';
import { FormatFunctions } from 'src/app/pipes/formating_text';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CalendarModule } from 'primeng/calendar';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { Table } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-invoice-history',
  standalone: true,
  imports: [
    DialogModule,
    TagModule,
    InputIconModule,
    IconFieldModule,
    InputTextModule,
    FormsModule,
    DropdownModule,
    TableModule,
    TitleCasePipe,
    DatePipe,
    FloatLabelModule,
    CalendarModule,
    CurrencyPipe
  ],
  providers: [
    UserService, 
    InvoiceService,
    FormatFunctions
  ],
  templateUrl: './invoice-history.component.html',
  styleUrl: './invoice-history.component.css'
})
export class InvoiceHistoryComponent implements OnInit {

  public tbl_invoice:any[];
  public loading: boolean = true;
  public token: string;
  public dateInput: Date;
  public statuses!: any[];
  public paymentStatuses!: any[];
  public dialogVisible: boolean;

  public selectedPayment: any;

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _activateRoute: ActivatedRoute,
    private _invoiceService: InvoiceService,
    private _formatFunctions: FormatFunctions,
    private _http: HttpClient) {

    this.token = this._userService.getToken();
    this.dialogVisible = false;


    this.statuses = [  
      { label: 'New', value: 'new' },
      { label: 'Overdue', value: 'overdue' }
    ];


    this.paymentStatuses = [
      { label: 'Paid', value: 'paid' },
      { label: 'Unpaid', value: 'unpaid' },
      { label: 'Split payment', value: 'splited' },
      { label: 'Pending', value: 'pending' }
    ]
  }


 ngOnInit() {

   this.getInvoiceHistory()
   this.convertImageToBase64() 
 
}

  generatePDF(){


    this._invoiceService.genPDF(this.invoiceSelected, this.logoBase64);
    
  }


getInvoiceStatus(invoice_status: string) {

  if(invoice_status == 'new') {
    return '';
  } else if(invoice_status == 'completed') {
    return 'success';
  }  
  else {
    return 'danger';
  }

}

  public searchValue: string;
  clear(table: Table) {
    table.clear();
    this.searchValue = ''
  }

getPaymentStatus(payment_status: string) {

  if (payment_status == 'pending') {
    return 'warning';
    } else if (payment_status == 'unpaid') {
      return 'danger';
    }else{
    return 'success';
    }
}

public idCondo: string;
public dateOptions:any[];

  getInvoiceHistory() {

    this._activateRoute.params.subscribe(params => {

      let condoId = params['condoId'];
      this.idCondo = condoId;

      this._invoiceService.getInvoiceByCondo(this.token, condoId).subscribe({
        next: (res) => {

          if(res.status == 'success') {
            this.loading = false;            
            let propertyDetails = [];
            res.invoices.forEach((invoice) => {
              invoice.invoice_issue = new Date(<Date>invoice.invoice_issue);
              invoice.ownerId.propertyDetails.forEach((property) => {
               invoice.unit = property.condominium_unit;
             
            
              });
            });

            
            this.tbl_invoice = res.invoices;
 
            this.dateOptions = this.tbl_invoice.map((invoice) => {
              return {label: invoice.date, value: invoice.date}
            })
          }


         },
        error: (err) => { 
          console.log(err);
        }

      })

    });

   
  }

  getSeverityFunc(severity) {
    return this._formatFunctions.getSeverity(severity);
  }

  back() {
    this._router.navigate(['/home', this.idCondo]);
  }

  
  public logoBase64: any;
  public selectedInvoice:any
  public invoiceSelected:any;

  getInvoiceInfo(info:any){

    this.dialogVisible = true;
    let dateIssue = new Date(info.invoice_issue).getMonth();
    this.invoiceSelected = info;
    
    const invoInfo = {
      fullname: info?.ownerId.ownerName + ' ' + info?.ownerId.lastname,
      unit: info.unit,
      invoice_issue: this._formatFunctions.getMonthName(dateIssue),
      alias: info?.condominiumId.alias,
      invoice_status: info.invoice_status,
      description: `Maintenance Fee - ${this._formatFunctions.getMonthName(dateIssue)}`,     
      total: info.invoice_amount
    }

    this.selectedInvoice = invoInfo;
    console.log("info:", invoInfo)

  }


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


