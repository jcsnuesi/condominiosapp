import { Component, OnInit, DoCheck, EventEmitter } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { UserService } from '../../service/user.service';
import { global } from '../../service/global.service';
import { MessageService } from 'primeng/api';
import { SuperUser } from '../../service/superuser.service';
import { CondominioService } from '../../service/condominios.service';


@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  providers: [UserService, MessageService, SuperUser, CondominioService]
})
export class CustomersComponent implements OnInit, DoCheck {
 
  private token: string = this._userService.getToken()
  public sendDataToModal:any ;
  public customers: any[] = [];
  public url:string;
  public selectedCustomers:any;
  public loading: boolean; 
  public loginInfo:any;

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
    private _activeRoute: ActivatedRoute,
    public _userService:UserService,
    private _messageService: MessageService,
    private _condominioService: CondominioService,
    private _superUser: SuperUser) {

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

    if (this.loginInfo.role == 'SUPERUSER') {
      
      this.setValues(event)
      this.tabMenu()

      this.activeItem = this.items[0]
      this.visible = true

    } else if(this.loginInfo.role == 'ADMIN') {

      this._router.navigate(['home/', event._id])
    
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
        console.log(this.loginInfo)
        // console.log(this.loginInfo.message.
        //   _id)
        this._condominioService.getPropertyByAdminId(this.token, this.loginInfo._id).subscribe(
          response => {

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

  

}
