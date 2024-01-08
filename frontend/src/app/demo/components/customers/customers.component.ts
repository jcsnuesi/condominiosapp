import { Component, OnInit, DoCheck, EventEmitter } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { UserService } from '../../service/user.service';
import { global } from '../../service/global.service';
import { User } from '../../models/user.model';


@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  providers: [UserService]
})
export class CustomersComponent implements OnInit, DoCheck {
 
  private token: string = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2NTU1ODk2MjE3MTI5NzgxZmZmMTg3N2UiLCJlbWFpbCI6Impjc2FudG9zQG1haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkWTV4eG84VEZ3ckJJdi5CMk5qRzZwT0JIRy5OUHNWbEdWbVZKWDFrNFlOcDNLZ2FWcXNqYXUiLCJyb2xlIjoiU1VQRVJVU0VSIiwiaWF0IjoxNzAzNTU4MjY4fQ._qyJtXv90tZG_Cvx45xAErAW0371NN09_YxCDD8GJFg"

  public sendDataToModal:any ;
  public customers: any[] = [];
  public url:string;
  public selectedCustomers:any;
  public adminInfo: User;
  public loading: boolean; 

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
    public _userService:UserService) {

    this.url = global.url
    this.statuses = [
      { label: 'Active', value: 'active' },
      { label: 'Suspended', value: 'suspended' },

    ];

     }

 
 ngOnInit() {

    this.loading = true    
    this.getAdmins()
    
   this._userService.customEvent.subscribe(data => {
     this.getAdmins()
     this.getValues().status = data == 'suspended' ? 'suspended' : 'active';
     this._userService.identity = this.getValues()
     this.tabMenu()


   })
  
  }

  ngDoCheck(): void {
 
    this._userService.identity = this.getValues()
      
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
    localStorage.clear()
   
  }

  dateFormat(date:string){
    //2023-11-05T19:32:38.422Z
    var longDate = date.split(/[-T]/)

    var year = longDate[0]
    var month = longDate[1]
    var day = longDate[2]
    const fullDate = year + '-' + month + '-' + day

    return fullDate

    
  }


  public datosUpdating:any;
 
  setValues(data){

    this.datosUpdating = data
  }

  getValues() {

   return this.datosUpdating
  }
   
  showDialog(event:any){
  
    this.setValues(event)   
    this.tabMenu()
    localStorage.setItem('user', JSON.stringify(event))

       
    this.activeItem = this.items[0]  
     
    this.visible = true  
    
  }

  
  getSeverity(status: string) {

    switch (status.toLowerCase()) {

      case 'suspended':
        return 'danger';

      case 'active':
        return 'success';
     
    }

    return null;
  }

 
  clear(table: Table) {
    table.clear();
  }
 
 
  getAdmins(){

    

    this._userService.admins(this.token).subscribe(

      admins =>{

        if (admins.status == 'success') {
          this.loading = false
          this.customers = admins.message
      
        }
     
    
      },
      err => {

        console.log(err)
      }
    )
  


  }

  

}
