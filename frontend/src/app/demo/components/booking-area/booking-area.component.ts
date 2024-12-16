
import { Component, AfterViewInit, EventEmitter, OnInit, Output, Input, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule, NgForm } from '@angular/forms';
import { FieldsetModule } from 'primeng/fieldset';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { HasPermissionsDirective } from 'src/app/has-permissions.directive';
import { PanelModule } from 'primeng/panel';
import { UserService } from '../../service/user.service';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { BookingServiceService } from '../../service/booking-service.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputNumberModule } from 'primeng/inputnumber';
import { Router, ActivatedRoute } from '@angular/router';
import { FormatFunctions } from 'src/app/pipes/formating_text';
import { DialogModule } from 'primeng/dialog';

type BookingType = {
  memberId: string;
  unit: string;  
  condoId: string;
  areaId: string;
  checkIn: string;
  checkOut: string;  
  status?: string;
  comments?: string;
  visitorNumber: number;
}

type Guest = {
  memberId: string;
  fullname: string;
  phone: string;
  checkIn: string;
  condoId: string;
  notifingType: string;
  notifing: string;
  comments?: string;
  unit: string;
}

@Component({
  selector: 'app-booking-area',
  standalone: true,
  imports: [ 
    DialogModule,
    ToastModule,
    InputNumberModule,
    ConfirmDialogModule,
    InputTextareaModule,
    InputTextModule,
    RadioButtonModule,
    HasPermissionsDirective,
    CommonModule,
    CalendarModule,
    FormsModule, 
    FieldsetModule,
    FloatLabelModule,
    DropdownModule,
    ButtonModule,
    TableModule,
    TagModule ,
    PanelModule
  ],
  providers: [UserService, 
    BookingServiceService, 
    MessageService, 
    ConfirmationService,
    FormatFunctions],
  templateUrl: './booking-area.component.html',
  styleUrl: './booking-area.component.css'
})
export class BookingAreaComponent implements OnInit {

  public dates: Date[];
  public selectedArea: any[];
  public areaOptions: any[];
  public bookingInfo:BookingType;
  public guestInfo: Guest;

  public condoOptions: any[];
  public selectedCondo: any[];
  public unitOption: any[];
  public loading: boolean;
  public bookingHistory: any[];
  public valRadio: string = '';
  public notifingOptions: any[]; 
  
  public token: string;
  public identity: any;
  public headerStatus:any[];

  public selectedRow: any[];
  public visibleDialog: boolean = false;

  
  constructor(
    private _userService: UserService,
    private _bookingService: BookingServiceService,
    private _messageService: MessageService,
    private _confirmationService: ConfirmationService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _format: FormatFunctions

  ) {       
    
    this.identity = this._userService.getIdentity()
    this.token = this._userService.getToken();

    this.bookingInfo = {
      memberId: '',
      unit: '',
      condoId: '',
      areaId: '',
      checkIn: '',
      checkOut: '',
      status: '',
      visitorNumber: 0,
    };

    this.headerStatus = [{ label: 'Reserved', value: 'Reserved' }, { label: 'Cancelled', value: 'Cancelled' }, { label: 'Guest', value: 'Guest' }];

    this.guestInfo = {
      memberId: '',
      fullname: '',  
      unit: '',  
      phone: '',
      checkIn: '',
      condoId: '',
      notifingType: '',
      notifing: ''
    };

    this.condoOptions = [];
    this.selectedRow = [];
    this.areaOptions = [];
    this.unitOption = [];
    this.loading = true;
    this.notifingOptions = [{ label: "Email" }, { label: "None" }];
    

    // console.log("GET IDENTITY:", this.identity)
 }
 
 ngOnInit(): void {
   
   this.getPropertyType();
   this._route.params.subscribe(params => {
    let idUser = params['id'];
    // console.log('ID:', idUser)
    if(idUser) {
      this.getAllBookings(idUser);
    }
   });


    // console.log('Booking Area Component');
 }

  actionChosen() {

   
    
    console.log('Action Chosen:', this.valRadio)
  }

   
  getPropertyType() {

    this.identity.propertyDetails.find((property) => {

      this.condoOptions.push({
        label: (property.addressId.alias).toUpperCase(), 
        code: property.addressId._id
      })   
      
      if (Boolean(property.condominium_unit)) {
        this.unitOption.push({
          label: property.condominium_unit,
          code: property.condominium_unit
        })

      }
      
      // console.log('Property this.unitOption-->:', this.identity)
      
    })

    
  }


  

  getAreaInfo(event: NgForm) {
    //  { label: 'DON ALONSO I', code: '65483be3a3d1607fea43e833' }
    let areaObj = event.value;
 
    this.identity.propertyDetails.forEach((area, index) => {

      if (area.addressId._id === areaObj.code && area.addressId.socialAreas.length > 0) {

        this.areaOptions = area.addressId.socialAreas.map((areaFound) => {
          return {label:areaFound, code: areaFound};
        })

      }
    

    });
  }

  public checkOutMgs:any;
  validateDates(form: NgForm) {
    const checkIn = form.controls['checkIn'].value;
    const checkOut = form.controls['checkOut'].value;

    if (checkIn && checkOut && checkIn > checkOut) {
      form.controls['checkOut'].setErrors({ invalidDate: true });
      form.controls['checkIn'].setErrors({ invalidDate: true });
      this.checkOutMgs = 'Check Out date must be greater than Check In date';
    } else {
      this.checkOutMgs = false;
      form.controls['checkOut'].setErrors(null);
      form.controls['checkIn'].setErrors(null);
    }
  }

  

  
  submit(form: any) {
   
    let data = null;
    let message = null;

    if(this.valRadio === 'guest') {
      data = {...this.guestInfo};
      data.isguest = true;
      message = 'Are you sure you want to make this action?';
    }else{
      data = {...this.bookingInfo};
      data.isguest = false;
      message = 'Are you sure you want to book this area?';
    } 

    let condominioId = data.condoId?.code
    let unitId = data.unit?.code
    let areaId = data.areaId?.code
    
    data.memberId = this.identity._id;
    data.condoId = condominioId;
    data.unit = unitId;
    data.areaId = areaId;
    console.log('Booking Response:----->', data)

    
    this._confirmationService.confirm({
      message: message,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: "p-button-text",
      accept: () => {

        this._bookingService.createBooking(this.token, data).subscribe({
          next: (response) => {

            if(response.status === 'success') {

              this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Booking was successful', life: 5000 });
              form.reset();
              this.guestInfo.notifingType = '';
            }
            // console.log('Booking Response:', response)
          },
          error: (errors) => {
            this._messageService.add({ severity: 'error', summary: 'Error', detail: errors.error.message, life:10000 });
            // console.log('Booking Error:', errors.error)
          }
        });
       
      },
      reject: () => {
        this._messageService.add({severity:'info', 
          summary:'Rejected', 
          detail:'You have rejected the booking'});
      }
    });
  
  }

  getAllBookings(id) {

        
    this._bookingService.getBooking(this.token, id).subscribe({
      next: (response) => {
        // this.bookingHistory = response.booking;
        if (response.status === 'success') {
          let allBookinInfo = response.message;
          console.log('Booking History:***************>', allBookinInfo)
          try {
            
            this.bookingHistory = allBookinInfo.map((booking) => {
              return {
                id: booking._id,
                guest: booking?.guest,
                condoName: booking.condoId.alias,
                unit: booking.apartmentUnit,
                area: booking?.areaToReserve ?? 'N/A',
                checkIn: this._format.dateTimeFormat(booking.checkIn) ,
                checkOut: this._format.dateTimeFormat(booking?.checkOut) ?? 'N/A',
                status: booking.status,
                visitorNumber: booking?.visitorNumber ?? 0,
                verified: Boolean(booking.guestCode)
              }
            });
          } catch (error) {

            console.log('Error:', error)           
          }
          
          
          this.loading = false;
 
        }

      },
      error: (errors) => {
        this._messageService.add({ severity: 'error', summary: 'Error', detail: errors.error.message, life:10000 });
        // console.log('Booking Error:', errors.error)
      }
    });
  }

  showDialog(customer:any){

    

    if (customer.status === 'Guest') {
      let guestInfo = customer.guest[0];
      this.guestInfo = {
        memberId:this.identity._id,
        fullname: guestInfo.fullname,  
        unit: customer.unit,  
        phone: guestInfo.phone,
        checkIn: customer.checkIn,
        condoId: customer.condoName,
        notifingType: guestInfo.notifingType,
        notifing: guestInfo.notifing
      }
    }
    this.visibleDialog = true;
  }
  getSeverity(status:string){
    let statuses = status.toLowerCase()

    if (statuses === 'reserved') {
      return 'success';
    } else if (statuses === 'cancelled') {
      return 'danger';
    } else {
      return 'info';
    }
    
  }
  areasAvailable(){
  
    
    let areasJson = JSON.parse(localStorage.getItem('property')) 

    if (areasJson.socialAreas
      && areasJson.socialAreas.length > 0) {

      areasJson.socialAreas.forEach((area, index) => {
        this.areaOptions.push({ label: area, name: area });
      });
      }


    }
  

  
  
}
