import { Component, OnInit } from '@angular/core';
import { TitleCasePipe, DatePipe } from '@angular/common';
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


@Component({
  selector: 'app-invoice-history',
  standalone: true,
  imports: [
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
    CalendarModule
  ],
  providers: [
    UserService, 
    InvoiceService,
    FormatFunctions
  ],
  templateUrl: './invoice-history.component.html',
  styleUrl: './invoice-history.component.scss'
})
export class InvoiceHistoryComponent implements OnInit {

  public tbl_invoice:any[];
  public loading: boolean = true;
  public token: string;
  public dateInput: Date;
  public statuses!: any[];
  public paymentStatuses!: any[];

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _activateRoute: ActivatedRoute,
    private _invoiceService: InvoiceService,
    private _formatFunctions: FormatFunctions) {

    this.token = this._userService.getToken();


    this.statuses = [  
      { label: 'New', value: 'new' },
      { label: 'Overdue', value: 'overdue' }
    ];

    this.paymentStatuses = [
      { label: 'Paid', value: 'paid' },
      { label: 'Unpaid', value: 'unpaid' },
      { label: 'Pending', value: 'pending' }
    ]
  }


 ngOnInit() {

   this.getInvoiceHistory()
 
}

getInvoiceStatus(invoice_status: string) {

  if(invoice_status == 'new') {
    return 'success';
  } else {
    return 'danger';
  }

}

  public searchValue: string;
  clear(table: Table) {
    table.clear();
    this.searchValue = ''
  }
getPaymentStatus(payment_status: string) {
  console.log("payment_status");
  console.log(payment_status);
  if (payment_status == 'pending') {
    return 'danger';
  } else {
      return 'success';
    }
}
public dateOptions:any[];

  getInvoiceHistory() {

    this._activateRoute.params.subscribe(params => {

      let condoId = params['condoId'];

      this._invoiceService.getInvoiceByCondo(this.token, condoId).subscribe({
        next: (res) => {

          if(res.status == 'success') {
            this.loading = false;            
            
            res.invoices.forEach((invoice) => {
              invoice.invoice_issue = new Date(<Date>this._formatFunctions.dateFormat2(invoice.invoice_issue)) ;
            });
            this.tbl_invoice = res.invoices;
            console.log(this.tbl_invoice);
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

  testing(v:any){
    console.log("****************************");
    console.log(v);
  }

}


// <th style="width:22%" > Invoice # </th>
//   < th style = "width:22%" > Fullname </th>invoice_issue

//     < th style = "width:22%" > Issue date </th>
//       < th style = "width:22%" > Invoice due </th>
//         < th style = "width:22%" > Description </th>
//           < th style = "width:22%" > Amount </th>
//             < th style = "width:12%" > Status </th>
//               < th style = "width:12%" > Payment Status </th>