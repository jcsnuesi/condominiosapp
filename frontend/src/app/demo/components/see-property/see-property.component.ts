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
import { HasPermissionsDirective } from 'src/app/has-permissions.directive';
import { HasRoleDirective } from 'src/app/has-role.directive';
import { FormatFunctions } from '../../../pipes/formating_text';
 
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
    ButtonModule,
    HasRoleDirective
    
  ],
  providers: [UserService, CondominioService, MessageService, FormatFunctions]  
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
  public addressInfo: any[] = [];

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
    private _condominioService: CondominioService,
    private _format: FormatFunctions,
   ) {

    this.url = global.url

    this.statuses = [
      { label: 'Active', value: 'active' },
      { label: 'Suspended', value: 'suspended' },

    ];

    this.loginInfo = this._userService.getIdentity()
    console.log('LOGIN INFO:', this.loginInfo)
  }


  ngOnInit() {

    this.loading = true
    this.getAdminsProperties()
 
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

  fechaCreacion(fecha) {
      
      return this._format.dateFormate(fecha)
  }

  

  getAdminsProperties(){


    switch (this.loginInfo.role) {
     
      case 'ADMIN':
       
      this._condominioService.getPropertyByAdminId(this.token, this.loginInfo._id).subscribe({
          next: (response) => {
            this.loading = false;
       
            if (response.status == 'success') {
              this.properties = response.message;
              console.log('PROPERTIES:', this.properties)

            }
          },
          error: (error) => {
            console.log(error);
          },
          complete: () => {
            console.log('See property completed!')
          }
        });
        break;
    
      case 'OWNER':

        this._userService.getPropertyByOwner(this.token).subscribe({
        next: (response) => {
          
          this.properties = [];
          this.loading = false;
          
          if (response.status == 'success') {

            response.message[0].propertyDetails.forEach((element) => {
             console.log('ELEMENT:', element)
              this.properties.push({
                avatar: element.addressId.avatar,
                alias: element.addressId.alias,
                phone: element.addressId.phone,
                address: element.addressId.address,
                city: element.addressId.city,
                country: element.addressId.country,
                province: element.addressId.province,
                sector_name: element.addressId.sector_name,
                street_1: element.addressId.street_1,
                street_2: element.addressId.street_2,
                createdAt: this._format.dateFormate(element.addressId.createdAt) ,
                property_id: element.addressId._id,
                status: element.addressId.status,
                mPayment: element.addressId.mPayment
              });
            });
           
;
          }
        },
        error: (error) => {
          console.log('For owner propuse:',error);
        },
        complete: () => {
          console.log('See OWNER property completed!')
        }
      })

        break;
    }    
  
  }
 

  ownerDialogDetails(){
      
      this.visible = true;
  }

  full_address_func(customer) {
    
    return `${customer.street_1}, ${customer.street_2}, ${customer.sector_name}, ${customer.city}, ${customer.province}, ${customer.country}`

  }

  propertyName(alias){

    return alias.toUpperCase()
  }


  

}
