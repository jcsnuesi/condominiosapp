import { Component, OnInit, Input } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { Table } from 'primeng/table';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { UserService } from '../../service/user.service';
import { global } from '../../service/global.service';
import { User } from '../../models/user.model';
import { UpdateCustomerComponent } from '../update-customer/update-customer.component';


@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  providers: [UserService, UpdateCustomerComponent]
})
export class CustomersComponent implements OnInit {

 
  private token: string = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2NTU1ODk2MjE3MTI5NzgxZmZmMTg3N2UiLCJlbWFpbCI6Impjc2FudG9zQG1haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkWTV4eG84VEZ3ckJJdi5CMk5qRzZwT0JIRy5OUHNWbEdWbVZKWDFrNFlOcDNLZ2FWcXNqYXUiLCJyb2xlIjoiU1VQRVJVU0VSIiwiaWF0IjoxNzAzNTU4MjY4fQ._qyJtXv90tZG_Cvx45xAErAW0371NN09_YxCDD8GJFg"

  public sendDataToModal:any ;
  public customers: any[] = [];
  public url:string;
  public selectedCustomers:any;
  public adminInfo: User;
 

  sortOptions: SelectItem[] = [];

  sortOrder: number = 0;

  sortField: string = '';

  sourceCities: any[] = [];

  targetCities: any[] = [];

  orderCities: any[] = [];

  public layout:string;
  public loading: boolean = true;
  public statuses!: any[];
  public representatives: any;
  public visible: boolean= false;
  public modify:boolean;
  public items:any[] = [];
  public activeItem:any;




  constructor(
    private _router: Router,
    private _activeRoute: ActivatedRoute,
    private _userService:UserService) {

    this.url = global.url
    this.loading = false
    this.statuses = [
      { label: 'Active', value: 'active' },
      { label: 'Suspended', value: 'suspended' },

    ];

    this.items = [
      { label: 'Account info', icon: 'pi pi-fw pi-home' },
      { label: 'Calendar', icon: 'pi pi-fw pi-calendar' },
      { label: 'Edit', icon: 'pi pi-fw pi-pencil' },
      { label: 'Documentation', icon: 'pi pi-fw pi-file' },
      { label: 'Settings', icon: 'pi pi-fw pi-cog' }
    ];

    this.modify = false
   
    
     }

  tabMenuFunction(event:any){
    console.log(event)

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

    public userInfo;
  showDialog(event:any){

    this.visible = true 
    this.userInfo = event
    this.activeItem = this.items[0]  
    this.items[0]  
    
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
  ngOnInit() {

    

    this.getAdmins()
  }

 
  getAdmins(){

    this._userService.admins(this.token).subscribe(

      admins =>{

        if (admins.status == 'success') {

          this.customers = admins.message
    

        }
     
    
      },
      err => {

        console.log(err)
      }
    )
  


  }

  

}
