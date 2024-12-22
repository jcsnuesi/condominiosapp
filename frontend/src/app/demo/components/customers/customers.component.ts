import { Component, OnInit, DoCheck, EventEmitter } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { UserService } from '../../service/user.service';
import { global } from '../../service/global.service';
import { MessageService } from 'primeng/api';
import { SuperUser } from '../../service/superuser.service';
import { CondominioService } from '../../service/condominios.service';
import { FormatFunctions } from '../../../pipes/formating_text';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  providers: [UserService, MessageService, SuperUser, CondominioService, FormatFunctions]
})
export class CustomersComponent implements OnInit, DoCheck {
 
  private token: string = this._userService.getToken()
  public sendDataToModal:any ;
  public customers: any[] = [];
  public url:string;
  public selectedCustomers:any;
  public loading: boolean; 
  public loginInfo:any;
  public header_changer:string;
  
  sortOptions: SelectItem[] = [];

  sortOrder: number = 0;

  sortField: string = '';

  sourceCities: any[] = [];

  targetCities: any[] = [];

  orderCities: any[] = [];

  public layout:string;
  public statuses!: any[];
  public representatives: any;
  public visible: boolean= false;
  public modify:boolean;
  public items: any[] = [];
  public activeItem:any;
  messageEvent:any;
  public status:string
  public identity:any;
 
  constructor(
    private _router: Router,
    public _userService:UserService,
    private _condominioService: CondominioService,
    private _superUser: SuperUser,
    private _formating: FormatFunctions) {

    this.url = global.url
    this.statuses = [
      { label: 'Active', value: 'active' },
      { label: 'Suspended', value: 'suspended' },

    ];

    this.loginInfo = this._userService.getIdentity()

     }

  
 ngOnInit() {

    this.loading = true    
    this.getAdmins()
    
    // habilitar o deshabilidar el MenuTab segun el estatus de la cuenta.
   this._userService.customEvent.subscribe(data => {
     this.getAdmins()
     this.getValues().status = data == 'suspended' ? 'suspended' : 'active';
     UserService.identity = this.getValues()
     this.tabMenu()

   })  
  }
 
  ngDoCheck(): void {
 
    UserService.identity = this.getValues()
      
  }

dateFormat(customer:any){

  this._formating.dateFormat(customer.created_at)

}

  tabMenu() {

    this.items =   [
      { label: 'Account info', icon: 'pi pi-fw pi-info-circle', routerLink: 'details' },
      { label: 'Properties', icon: 'pi pi-fw pi-home', routerLink: 'properties', disabled: false, queryParams:{id:this.getValues().id}},
      { label: 'Edit', icon: 'pi pi-fw pi-pencil', disabled: false },
      { label: 'Documentation', icon: 'pi pi-fw pi-file', routerLink: 'docs', disabled: false },
      { label: 'Settings', icon: 'pi pi-fw pi-cog', disabled: false }
    ]

    this.items.forEach(item => {
      item.disabled = this.getValues().status == 'suspended' ? true : false
    
    })


  }

     
  handleEvent() {
    this._router.navigate(['/customers'])
   
  }


  public datosUpdating:any;
 
  setValues(data){

    this.datosUpdating = data
  }

  getValues() {

   return this.datosUpdating
  }
   
  showDialog(event:any){

    switch (this.loginInfo.role) {
      
      case 'SUPERUSER':

        this.setValues(event)
        this.tabMenu()
        window.location.href + '/customers/details'
     
        this.activeItem = this.items[0]
        this.visible = true
        
        break;

      case 'ADMIN':

          
        this._router.navigate(['home/', event._id])
        
        break;
    
    }
   
  }
 
  
  
  clear(table: Table) {
    table.clear();
  }
 
 
  getAdmins(){

   
    switch (this.loginInfo.role) {
     
      case 'SUPERUSER':

        this._superUser.getAdmins(this.token).subscribe(

          admins => {

            if (admins.status == 'success') {
             
              this.header_changer = 'Email'
              this.loading = false
              this.customers = admins.message

            }            


          },
          err => {

            console.log(err)
          }
        )
        
        break;

      case 'ADMIN':

        this._condominioService.getPropertyByAdminId(this.token, this.loginInfo._id).subscribe(
          response => {
            this.header_changer = 'Address'
           
            this.loading = false
            this.customers = response.message
           
            console.log(response)
          },
          error => {
            console.log(error)
          }
        )

      break;
    
    }
   
    
  }

  full_address_func(customer) {

    if (this.header_changer == 'Address') {

      return `${customer.street_1}, ${customer.street_2}, ${customer.sector_name}, ${customer.city}, ${customer.province}, ${customer.country}`

    }else{
      return customer.email_company
    }
    
  }

  phones_number_func(customer){

  
    var full_phone_num = ''
    if ((customer.phone[-1] != undefined)) {
  
      full_phone_num = `${customer.phone[0]} ${customer.phone[1]}`
   
    }else{

      full_phone_num = `${customer.phone} ${customer.phone2}`
    }
   
    return full_phone_num

  }
 
  

}
