import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DataView } from 'primeng/dataview';
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
export class CustomersComponent implements OnInit {

  private token: string = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2NTU1ODk2MjE3MTI5NzgxZmZmMTg3N2UiLCJlbWFpbCI6Impjc2FudG9zQG1haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkWTV4eG84VEZ3ckJJdi5CMk5qRzZwT0JIRy5OUHNWbEdWbVZKWDFrNFlOcDNLZ2FWcXNqYXUiLCJyb2xlIjoiU1VQRVJVU0VSIiwiaWF0IjoxNzAzNTU4MjY4fQ._qyJtXv90tZG_Cvx45xAErAW0371NN09_YxCDD8GJFg"


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
  public visible: boolean;
  public modify:boolean;


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

    this.modify = false

   

     
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

  showDialog(event:any){
    this.visible = true
    this.adminInfo = event
    console.log(this.adminInfo.company)
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

    this.visible = false



    this.sortOptions = [
      { label: 'Price High to Low', value: '!price' },
      { label: 'Price Low to High', value: 'price' }
    ];

    this.getAdmins()
  }


  
  // onSortChange(event: any) {
  //   const value = event.value;
    

  //   if (value.indexOf('!') === 0) {
  //     this.sortOrder = -1;
  //     this.sortField = value.substring(1, value.length);
  //   } else {
  //     this.sortOrder = 1;
  //     this.sortField = value;
  //   }
  // }

  // onFilter(dv: DataView, event: Event) {
  //   dv.filter((event.target as HTMLInputElement).value);
  // }

 
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

  update(event:any){

  }

}
