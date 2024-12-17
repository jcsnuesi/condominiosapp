
import { Component, AfterViewInit, EventEmitter, OnInit, ViewChild, ViewContainerRef, ComponentRef, Renderer2, ChangeDetectorRef } from '@angular/core';
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
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { format, parse, parseISO } from 'date-fns';


type BookingType = {
  fullname?: string;
  phone?: string;
  memberId: any;
  unit: any;  
  condoId: any;
  areaId?: any;
  checkIn: string;
  checkOut?: string;  
  status?: string;
  comments?: string;
  visitorNumber?: number;
  notifingType?: string;
  notifing?: string;
}



@Component({
  selector: 'app-booking-area',
  standalone: true,
  imports: [ 
    IconFieldModule,
    InputIconModule,
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
    private _format: FormatFunctions,
    private cdr: ChangeDetectorRef


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
      notifingType: '',
      notifing: '',
      phone: '',
      fullname: ''
    };

    

    this.headerStatus = [{ label: 'Reserved', value: 'Reserved' }, { label: 'Cancelled', value: 'Cancelled' }, { label: 'Guest', value: 'Guest' }];

    
    this.condoOptions = [];
    this.selectedRow = [];
    this.areaOptions = [];
    this.unitOption = [];
    this.loading = true;
    this.notifingOptions = [{ label: "Email" }, { label: "None" }];
    this.bookingInfoApt = {};

    // console.log("GET IDENTITY:", this.identity)
 }
  updateBookingObj(){
    this.bookingInfo = {
      memberId: '',
      unit: '',
      condoId: '',
      areaId: '',
      checkIn: '',
      checkOut: '',
      status: '',
      visitorNumber: 0,
      notifingType: '',
      notifing: '',
      phone: '',
      fullname: ''
    };
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


  

  getAreaInfo(event: any) {

    //  { label: 'DON ALONSO I', code: '65483be3a3d1607fea43e833' }    
    let areaObj = event.value;
 
    this.identity.propertyDetails.forEach((area, index) => {

      if (Boolean(areaObj == undefined)){

        this.areaOptions = area.addressId.socialAreas.map((areaFound) => {
          
          return { label: areaFound.toUpperCase(), code: areaFound.toUpperCase() }
        })

      }else if(area.addressId._id === areaObj.code && area.addressId.socialAreas.length > 0) {

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
    data = { ...this.bookingInfo };
    
    if(this.valRadio === 'guest') {
      data.isguest = true;
      message = 'Are you sure you want to make this action?';
    }else{
    
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
              this.bookingInfo.notifingType = '';
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
          
          try {
            
            this.bookingHistory = allBookinInfo.map((booking) => {
              return {
                id: booking._id,
                guest: booking?.guest[0],
                condoName: booking.condoId.alias,
                unit: booking.apartmentUnit,
                area: booking?.areaToReserve ?? 'N/A',
                checkIn: this._format.dateTimeFormat(booking.checkIn),
                checkOut: this._format.dateTimeFormat(booking?.checkOut) ?? 'N/A',
                status: booking.status,
                visitorNumber: booking?.visitorNumber ?? 0,
                verified: Boolean(booking.guestCode),              
                comments: booking?.comments          
                
              }
              
            });
            console.log('Booking History:***************>', this.bookingHistory)
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


  public inputData: string[] = [];
  public inputValues: string[] = [];


  parseDate(dateString: string): Date {

    if (Boolean(dateString == undefined)) {
      return null;
    }
    // Detecta el formato de la fecha y la convierte en un objeto Date
    if (dateString.includes('T')) {
      // Formato ISO
      return parseISO(dateString);
    } else {
      // Formato dd-MM-yyyy HH:mm
      return parse(dateString, 'dd-MM-yyyy HH:mm', new Date());
    }
  }


  addVisitor() {
   
    this.inputData.push('');   
    this.inputValues.push('');
    }

  public datoss:any;
  removeInput(id:number){
    this.inputData.splice(id, 1)
    this.inputValues.splice(id, 1)
  }

  public bookingInfoApt: any;
  showDialog(customer:any){
    
    console.log("customer------>", customer)
    console.log("areaOptions------>", this.areaOptions)
 
    let guestInfo = customer.guest;
    this.getAreaInfo(customer.area)

    this.bookingInfoApt = {
      memberId: this.identity._id,
      fullname: guestInfo?.fullname,
      unit: { label: customer.unit, code: customer.unit },
      phone: guestInfo?.phone,
      checkIn: this.parseDate(customer.checkIn) ?? 'N/A',
      checkOut: customer?.checkOut != 'N/A' ? this.parseDate(customer?.checkOut) : null,
      condoId: { label: (customer.condoName).toUpperCase(), code: this.condoOptions.find((condo) => (condo.label).toLowerCase() === (customer.condoName).toLowerCase()).code },
      areaId: { label: (customer.area).toUpperCase(), code: (customer.area).toUpperCase() },
      notifingType: guestInfo?.notifingType,
      notifing: guestInfo?.notifing,
      visitorNumber: customer?.visitorNumber,
      status: { label: customer.status, value: customer.status } ,
      comments: customer?.comments,
      notifyMany:[]

    }
    this.visibleDialog = true;
    this.cdr.detectChanges();

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

    update(){

      let data = {...this.bookingInfoApt}
      data.notifyMany = this.inputValues
      let unitlabel = this.bookingInfoApt.unit.label
      let condoIdlabel = this.bookingInfoApt.condoId.label
      let areaIdlabel = this.bookingInfoApt.areaId.label
      let statuslabel = this.bookingInfoApt.status.value

      data.unit = unitlabel;
      data.condoId = condoIdlabel;
      data.areaId = areaIdlabel;
      data.status = statuslabel;

      console.log("SELECTIONS:", data)
      console.log("this.bookingInfoApt.status:", this.bookingInfoApt.status)


   

    }
  

  
  
}
