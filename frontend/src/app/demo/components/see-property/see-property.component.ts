import { Component, OnInit, DoCheck } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { UserService } from '../../service/user.service';
import { global } from '../../service/global.service';
import { MessageService } from 'primeng/api';
import { CondominioService } from '../../service/condominios.service';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { TabMenuModule } from 'primeng/tabmenu';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-see-property',  
  templateUrl: './see-property.component.html',
  styleUrls: ['./see-property.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    TabMenuModule,
    TagModule,
    TableModule,
    ButtonModule
  ],
  providers: [UserService, CondominioService, MessageService]  
})

export class SeePropertyComponent implements OnInit, DoCheck {

  private token: string = this._userService.getToken()
  public sendDataToModal: any;
  public customers: any[] = [];
  public url: string;
  public selectedCustomers: any;
  public loading: boolean;
  public loginInfo: any;
  public header_changer: string;

  sortOptions: SelectItem[] = [];

  sortOrder: number = 0;

  sortField: string = '';

  sourceCities: any[] = [];

  targetCities: any[] = [];

  orderCities: any[] = [];

  public layout: string;
  public statuses!: any[];
  public representatives: any;
  public visible: boolean = false;
  public modify: boolean;
  public items: any[] = [];
  public activeItem: any;
  messageEvent: any;
  public status: string
  public identity: any;
  public properties: any;

  constructor(
    private _router: Router,
    public _userService: UserService,
    private _condominioService: CondominioService
   ) {

    this.url = global.url

    this.statuses = [
      { label: 'Active', value: 'active' },
      { label: 'Suspended', value: 'suspended' },

    ];

    this.loginInfo = this._userService.getIdentity()

  }


  ngOnInit() {

    this.loading = true
    this.getAdminsProperties()
    // this.getAdmins()
  
    
  }

  ngDoCheck(): void {

    UserService.identity = this.getValues()

  }

  public datosUpdating: any;

  setValues(data) {

    this.datosUpdating = data
  }

  getValues() {

    return this.datosUpdating
  }

  goToDashboard(event: any) {

    
    this._router.navigate(['home/', event._id])

  }



  clear(table: Table) {
    table.clear();
  }

  getAdminsProperties() {
    this._condominioService.getPropertyByAdminId(this.token, this.loginInfo._id).subscribe({
      next: (response) => {
        this.loading = false;
        console.log(response);
        if (response.status == 'success') {
          this.properties = response.message;
          
        }
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        // Code to execute after the observable completes, if needed
      }
    });
  }


  
  // getAdmins() {


  //   this._condominioService.getPropertyByAdminId(this.token, this.loginInfo._id).subscribe(
  //     response => {       

  //       this.loading = false
  //       console.log(response)
  //       if (response.status == 'success')
          
  //         this.properties = response.message  
        
  //     },
  //     error => {
  //       console.log(error)
  //     }
  //   )

  // }

  full_address_func(customer) {
    
    return `${customer.street_1}, ${customer.street_2}, ${customer.sector_name}, ${customer.city}, ${customer.province}, ${customer.country}`

  }

  propertyName(alias){

    return alias.toUpperCase()
  }

  // phones_number_func(customer) {

  //   console.log("PHONE NUMBER TO SHOW:",customer)
  //   var full_phone_num = ''
  //   if ((customer.phone[-1] != undefined)) {

  //     full_phone_num = `${customer.phone[0]} ${customer.phone[1]}`

  //   } else {

  //     full_phone_num = `${customer.phone} ${customer.phone2}`
  //   }

  //   return full_phone_num

  // }

}
