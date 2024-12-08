import { Component, EventEmitter, OnInit, Output, Input, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CondominioService } from '../../service/condominios.service';
import { dateTimeFormatter } from '../../service/datetime.service';
import { OwnerModel } from '../../models/owner.model';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute } from '@angular/router';
import { global } from '../../service/global.service';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu'; 
import {  ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { TabViewModule } from 'primeng/tabview';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { UserService } from '../../service/user.service';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService } from 'primeng/api';
import { OwnerRegistrationComponent } from '../owner-registration/owner-registration.component';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ToolbarModule } from 'primeng/toolbar';
import { FamilyMemberComponent } from '../family-member/family-member.component';
import { DropdownModule } from 'primeng/dropdown';
import { PaymentsHistoryComponent } from '../payments-history/payments-history.component';
import { InviceGeneraterComponent } from '../invice-generater/invoice-generater.component';
import { DynamicDialogRef, DynamicDialogModule } from 'primeng/dynamicdialog';
import { DialogService } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { FamilyMemberDetailsComponent } from "../family-member-details/family-member-details.component";
import { BookingAreaComponent } from '../booking-area/booking-area.component';
import { StepperModule } from 'primeng/stepper';
import { DividerModule } from 'primeng/divider';
import { InvoiceService } from '../../service/invoice.service';
import { FormatFunctions } from 'src/app/pipes/formating_text';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Router } from '@angular/router';
import { StaffService } from '../../service/staff.service';

type FamilyAccess = {

  avatar: string,
  name: string,
  lastname: string,
  gender: string,
  phone: string,
  email: string,
  password: string,
  status: string,
  role: string

}


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    
    DividerModule,
    ProgressSpinnerModule,
    BookingAreaComponent,
    ButtonModule,
    DynamicDialogModule,
    PaymentsHistoryComponent,
    DropdownModule,
    TableModule,
    AvatarModule,
    AvatarGroupModule,
    MenuModule,
    FormsModule,
    CommonModule,
    ChartModule,
    TabViewModule,
    DialogModule,
    FileUploadModule,
    InputGroupModule,
    InputGroupAddonModule,
    ToastModule,
    ConfirmDialogModule,
    OwnerRegistrationComponent,
    InputTextModule,
    InviceGeneraterComponent,
    FamilyMemberDetailsComponent,
    StepperModule
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [
    MessageService,   
    CondominioService,
    UserService,
    ConfirmationService,
    DialogService,
    InvoiceService,
    FormatFunctions,
    StaffService
    
  ]
})
export class HomeComponent implements OnInit {


  public maximized: boolean;
  public customers: any[];
  public items!: any[];
  public options: any;
  public dataChart: any;
  public image: any;
  public ownerObj: OwnerModel;
  public visible: boolean = false;
  public visible_invoice: boolean = false;
  public visible_owner: boolean = false;
  public identity: any; 
  private token: string;
  public genderOption: any;
  public passwordOwner: boolean;
  public formData = new FormData()
  public messageApiResponse: { message: string, severity: string };
  public apiUnitResponse: boolean;
  public isRentOptions: any[];
  public property_typeOptions: any[] = []
  public units: number;
  public url:string;
  public dateFormatted: string;
  public authorizedUser: FamilyAccess[];
  public addressInfo: any;
  public nodata: boolean;  
  public visible_dynamic: boolean;  
  public genderModel: { name: string, code: string }[];
  @Output() propertyInfoEvent: EventEmitter<any> = new EventEmitter();
  ref: DynamicDialogRef;
  public bookingVisible:boolean;
  public chartVisible:boolean;
  public stafflistNumber:number;


  @ViewChild(InviceGeneraterComponent) invoiceGenerator: InviceGeneraterComponent;

  constructor(
    private _userService: UserService,
    private _messageService: MessageService,
    private _confirmationService: ConfirmationService,
    public _condominioService: CondominioService,
    private _activatedRoute: ActivatedRoute,
    private dialogService: DialogService,
    private _invoiceService: InvoiceService,
    private _formatFunctions: FormatFunctions,
    private _router: Router,
    private _staffService: StaffService
  ){

    this.items = [
      { label: 'Add New', icon: 'pi pi-fw pi-plus' },
      { label: 'Remove', icon: 'pi pi-fw pi-minus' }
    ];

    this.chartVisible = false;
    this.stafflistNumber = 0;

    this.ownerObj = new OwnerModel('', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
    this.bookingVisible = false;
    this.url = global.url
    this.identity = this._userService.getIdentity()
    this.token = this._userService.getToken()
    
    this.genderOption = [
      { name: 'Male', gender: 'm' },
      { name: 'Female', gender: 'f' }
    ];

    this.isRentOptions = [
      { name: 'Yes', code: true },
      { name: 'No', code: false }
    ]

    this.authorizedUser = [
        { avatar: 'avatar1.png', 
          name: 'John', 
          lastname: 'Mendez',
        gender:"Male",
        phone: '809-555-5555',
        email: 'jmendex@mail.com',
        password: 'password',
        status: 'active',
        role: 'Owner'
      }
    ]

    this.property_typeOptions = [
      { "name": "House", code: "house" },
      { "name": "Apartment", code: "apartment" },
      { "name": "Condo", code: "condo" },
      { "name": "Townhouse", code: "townhouse" },
      { "name": "Villa", code: "villa" },
      { "name": "Penthouse", code: "penthouse" },
    ]
    this.messageApiResponse = { message: '', severity: '' }
    // this.apiUnitResponse = false

    this.genderModel = [
      { name: 'Female', code: 'F' },
      { name: 'Male', code: 'M' }
    ];

  }

  allBooking(){

    if(this.bookingVisible){
      this.bookingVisible = false;
    }else{
      this.bookingVisible = true;
    }
  
  }

  seeStaff(){
      
      this._router.navigate(['/staff', this.getCondoId()._id])
  }


  ngOnInit() {

    // INIT INFO 
    this.onInitInfo() 
    this.getStaffByCondoId();
    

  } 


  procesarFactura(event){
    this.onInitInfo();
    this.visible_invoice = false;
    this._messageService.add(event);
  }
 
  // Open Invoice generater dialog
  openInvoiceGenerator() {
    this.invoiceGenerator.open();
  }


  propertyData(data) {
    // emit data to parent component
    this.propertyInfoEvent.emit(data);
  }

  unitFormatOnInit(unit) {
    var unitList = []
    for (let index = 0; index < unit.length; index++) {
      unitList.push(unit[index].condominium_unit)

    }

    return unitList.join(", ")
  }

  public userDialog: boolean;
  
  openNew() {
    this.userDialog = true;


  }

  hideDialog() {
    this.userDialog = false;
    this.maximized = false;

  }

  public totalBooked:number = 0;
  onInitInfo() {

    this._activatedRoute.params.subscribe(param => {

      let id = param['id'];


      if (id != undefined) {

        this._condominioService.getBuilding(id, this.token).subscribe(
          response => {
         
            if (response.status == 'success') {

              var unitList = response.message              
             
              localStorage.setItem('property', JSON.stringify(unitList))
              this.units = (unitList.units_ownerId.length)

              this.dateFormatted = dateTimeFormatter(unitList.createdAt)

              this.propertyData(unitList)
              // Total de booking - falta implementar la funcion de booking para cargcar el total de booking
              this.totalBooked =  0;
              console.log("unitList", unitList)
            
              this.getInvoiceByCondoFunc(unitList)
              this.customers = unitList.units_ownerId

            }


          },
          error => {

            console.log(error)
          }
        )
      }




    })
  }

  onSelect(file: any) {

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64Data = reader.result as string;
      this.image = base64Data

    };

    reader.readAsDataURL(file.files[0])
    this.ownerObj.avatar = file.files[0]

  }
  getSeverity(severity: string) {
    return severity == 'active' ? 'success' : 'danger';

  }

  showDialog() {
    this.visible = true;

    this.ownerObj = new OwnerModel('', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '')

  }

  showOwnerDialog(events) {
    this.ownerObj = events  
    this.maximized = true; 
   
    this.image = this.url + 'owner-avatar/' + events.avatar
    this.visible_owner = true;

    
    if (this.identity._id == events._id) {

      this.passwordOwner = true

    } else {

      this.passwordOwner = false
      
    }


  }

  onSubmitUnit() {

    const formData = new FormData()

    formData.append('avatar', (this.ownerObj.avatar != null ? this.ownerObj.avatar : 'noimage.jpeg'))
    formData.append('ownerName', this.ownerObj.ownerName)
    formData.append('lastname', this.ownerObj.lastname)
    formData.append('gender', this.ownerObj.gender)
    formData.append('id_number', this.ownerObj.id_number)
    // formData.append('dob', this.ownerObj.phone2)
    formData.append('phone', this.ownerObj.phone)
    formData.append('phone2', this.ownerObj.phone2)
    formData.append('email', this.ownerObj.email)
    formData.append('addressId', this.ownerObj.addressId)
    formData.append('apartmentUnit', this.ownerObj.apartmentsUnit)
    formData.append('parkingsQty', this.ownerObj.parkingsQty)
    formData.append('isRenting', this.ownerObj.isRenting)

    this._condominioService.createOwner(this.token, formData).subscribe({
      next: (response) => {

        if (response.status == 'success') {
          this.messageApiResponse.message = response.message
          this.messageApiResponse.severity = 'success'
          this.apiUnitResponse = true

        } else {
          this.messageApiResponse.message = response.message
          this.messageApiResponse.severity = 'danger'
          this.apiUnitResponse = true
        }
      },
      error: (error) => {
        this._messageService.add({ severity: 'warn', summary: 'Message for server', detail: 'Unit was not Created', life: 3000 });
        console.log(error)
      },
      complete: () => {
        this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Unit Created', life: 3000 });


      }
    })


  }

  confirmUpdate(event: Event) {

    this._confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Please confirm to proceed moving forward.',
      icon: 'pi pi-exclamation-circle',
      acceptIcon: 'pi pi-check mr-1',
      rejectIcon: 'pi pi-times mr-1',
      acceptLabel: 'Confirm',
      rejectLabel: 'Cancel',
      rejectButtonStyleClass: 'p-button-outlined p-button-sm',
      acceptButtonStyleClass: 'p-button-sm',
      accept: () => {
        this._messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });

        this.onUpdate()

      },
      reject: () => {
        this._messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    });


  }

  onUpdate() {

    this.formData.append('avatar', (this.ownerObj.avatar != null ? this.ownerObj.avatar : 'noimage.jpeg'))

    for (const key in this.ownerObj) {

      if (key == 'avatar' || key == 'propertyDetails' || key == 'familyAccount') {
        continue;

      } else {

        this.formData.append(key, this.ownerObj[key])
      }

    }  
    
  }

  getCondoId(){

    return JSON.parse(localStorage.getItem('property'))
  }

  public activeStaffQty:number;
  // Carga los staff por condominio
  getStaffByCondoId() {

    let condoId = this.getCondoId() 

    this._staffService.getStaffByCondo(this.token, condoId._id).subscribe({

      next: (response) => {

        if (response.status == 'success') {
          this.activeStaffQty = response.message.filter((staff) => staff.status == 'active').length;
          this.stafflistNumber = response.message.length;        
        }

      },
      error: (error) => {
        console.log(error);
      }


    });


  }



  getInvoiceByCondoFunc(cantidadOwner) {
   
    let condoId = this.getCondoId()    

    this._invoiceService.getInvoiceByCondo(this.token, condoId._id).subscribe({
      next:  (response) => {

       
        if (cantidadOwner.units_ownerId.length != undefined) {            
       
          this.chartVisible = true;

        }
     
        if (response.status == 'success') {
         
          let invoiceResp = response.invoices

          // GRAPH VARIABLES
          const documentStyle = getComputedStyle(document.documentElement);

          const textColor = documentStyle.getPropertyValue('--text-color');

          const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');

          const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

          let paidData = {}
          let unpaidData = {}

          invoiceResp.forEach(element => {
            let { invoice_amount, invoice_status,
              paymentStatus, invoice_paid_date, invoice_issue } = element


            if (typeof invoice_paid_date === 'string' && invoice_paid_date != null) {

              let monthName = this._formatFunctions.getMonthName(parseInt(invoice_paid_date.split(/[-T]/)[1]))

              if (paidData[monthName] == undefined) {
                paidData[monthName] = 0
              }
              paidData[monthName] = paidData[monthName] + 1


            } else {

              let monthNameUnpaid = this._formatFunctions.getMonthName(parseInt(invoice_issue.split(/[-T]/)[1]))

              if (unpaidData[monthNameUnpaid] == undefined) {
                unpaidData[monthNameUnpaid] = 0
              }
              unpaidData[monthNameUnpaid] = unpaidData[monthNameUnpaid] + 1

            }

          })


          this.dataChart = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [
              {
                label: 'Paid',
                backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                borderColor: documentStyle.getPropertyValue('--blue-500'),
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

              },
              {
                label: 'Unpaid',
                backgroundColor: documentStyle.getPropertyValue('--red-500'),
                borderColor: documentStyle.getPropertyValue('--red-500'),
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          };

          for (const key in paidData) {

            this.dataChart.datasets[0].data[this.dataChart.labels.indexOf(key)] = paidData[key]

          }

          for (const key in unpaidData) {
            this.dataChart.datasets[1].data[this.dataChart.labels.indexOf(key)] = unpaidData[key]
          }

          this.options = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
              legend: {
                labels: {
                  color: textColor
                }
              }
            },
            scales: {
              x: {
                ticks: {
                  color: textColorSecondary,
                  font: {
                    weight: 500
                  }
                },
                grid: {
                  color: surfaceBorder,
                  drawBorder: false
                }
              },
              y: {
                beginAtZero: true,
                max: cantidadOwner.units_ownerId.length,
                ticks: {
                  color: textColorSecondary
                },
                grid: {
                  color: surfaceBorder,
                  drawBorder: false
                }
              }

            }
          };
        }




      },
      error: (error) => {
        console.log(error)
      },
      complete: () => {



        console.log('completed')
      }
    })
  }

  invoiceHistory(){

    let condoId = this.getCondoId()

    this._router.navigate(['/invoice-history', condoId._id])



  }





}
