
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


type BookingType = {
  memberId: string;
  bookedBy: string;
  unit: string;  
  condoId: string;
  areaId: string;
  checkIn: string;
  checkOut: string;  
  status?: string;

  

}

type Guest = {
  fullname: string;
  email: string;
  phone: string;
  dateArrival: string;
  condoId: string;
  notifingType: string;
  notifing: string;
}

@Component({
  selector: 'app-booking-area',
  standalone: true,
  imports: [ 
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
  templateUrl: './booking-area.component.html',
  styleUrl: './booking-area.component.css'
})
export class BookingAreaComponent implements OnInit {

  public dates: Date[] = [];
  public selectedArea: any[];
  public areaOptions: any[] = [];
  public bookingInfo:BookingType[];
  public guestInfo: Guest;

  public condoOptions: any[];
  public selectedCondo: any[];
  public identity: any;
  public loading: boolean;
  public bookingHistory: any[];
  public valRadio: string = '';
  public notifingOptions: any[]; 
 
  
  
  constructor(private _userService: UserService) { 

   this.bookingInfo = [ {
     memberId:'',
     bookedBy: '',
     unit: '',
     condoId: '',
     areaId: '',
     checkIn: '',
     checkOut: '',
     status: ''
   }];

    this.guestInfo = {
      fullname: '',
      email: '',
      phone: '',
      dateArrival: '',
      condoId: '',
      notifingType: '',
      notifing: ''
    };

    this.identity = this._userService.getIdentity()

    this.condoOptions = [];
    this.areaOptions = [];
    this.loading = true;
    this.notifingOptions = [{ label: "Email" }, { label: "None" }];
    
 

    // console.log("GET IDENTITY:", this.identity)
 }
 
 ngOnInit(): void {
   
   this.getPropertyType();
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
    if (checkIn && checkOut && checkIn >= checkOut) {
      form.controls['checkOut'].setErrors({ invalidDate: true });
      form.controls['checkIn'].setErrors({ invalidDate: true });
      this.checkOutMgs = 'Check Out date must be greater than Check In date';
    } else {
      this.checkOutMgs = false;
      form.controls['checkOut'].setErrors(null);
      form.controls['checkIn'].setErrors(null);
    }
  }

  ngAfterViewInit() {

    // this.areaCalentarRef.nativeElement.style.top = '0px';
    // Accede a las propiedades del componente p-calendar después de que la vista se haya inicializado

 
  
    
  }

  submitBooking(form: any) {
    console.log('Booking Info:', this.bookingInfo)
  }
  
  submitGuest(form: any) {
    console.log('Guest Info:', this.guestInfo)
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
